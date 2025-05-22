import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth/authService";
import { sessionService } from "@/services/auth/sessionService";
import { userService } from "@/services/auth/userService";

// Типы данных
export type UserRole = "manager" | "employee";

export interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

/**
 * Хук для управления аутентификацией пользователя
 */
export function useAuth(navigateTo?: string) {
  // Состояние формы входа
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    role: "manager",
  });

  // Состояние ошибки
  const [error, setError] = useState<string | null>(null);

  // Хук для навигации
  const navigate = useNavigate();

  /**
   * Обработчик изменения полей ввода
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  /**
   * Обработчик изменения роли пользователя
   */
  const handleRoleChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  }, []);

  /**
   * Перенаправляет пользователя в зависимости от роли
   */
  const redirectToRolePage = useCallback(
    (role: UserRole) => {
      const targetPath = role === "manager" ? "/dashboard" : "/employee";
      const path = navigateTo || targetPath;
      navigate(path);
    },
    [navigate, navigateTo],
  );

  // Проверяет существующую сессию пользователя
  // Если сессия найдена, перенаправляет на соответствующую страницу
  const checkExistingSession = useCallback(() => {
    try {
      // Удостоверимся, что у нас есть дефолтные пользователи
      userService.initializeDefaultUsers();

      // Получаем текущую сессию
      const session = sessionService.getCurrentSession();

      // Если сессия существует и пользователь аутентифицирован
      if (session && session.isAuthenticated) {
        // Вместо прямого вызова redirectToRolePage, возвращаем true
        // и данные о роли для дальнейшей обработки в компоненте
        return {
          authenticated: true,
          role: session.role as UserRole,
        };
      }

      // Проверяем наличие сообщения об ошибке
      const errorMessage = sessionService.getErrorMessage();
      if (errorMessage) {
        setError(errorMessage);
      }

      return {
        authenticated: false,
        role: null,
      };
    } catch (error) {
      console.error("Ошибка при проверке сессии:", error);
      // В случае ошибки лучше сбросить сессию
      sessionService.clearSession();
      return {
        authenticated: false,
        role: null,
      };
    }
  }, []);

  /**
   * Обработчик отправки формы входа
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Валидация формы
      if (!formData.username.trim() || !formData.password.trim()) {
        setError("Пожалуйста, заполните все поля");
        return;
      }

      try {
        console.log("Отправка формы авторизации:", formData);

        // Создаем копию данных формы для гарантии отсутствия мутации
        const credentials = { ...formData };

        // ИСПРАВЛЕНИЕ: принудительно устанавливаем корректную роль для известных пользователей
        if (credentials.username === "manager") {
          credentials.role = "manager";
        } else if (credentials.username === "employee") {
          credentials.role = "employee";
        }

        // Попытка авторизации
        const result = authService.login(credentials);

        if (result.success && result.user) {
          console.log("Успешный вход:", result.user);

          // При успешном входе показываем уведомление - используем setTimeout
          // для предотвращения обновления состояния во время рендеринга
          setTimeout(() => {
            toast.success(`Добро пожаловать, ${result.user!.name}!`, {
              duration: 3000,
            });

            // Перенаправляем на соответствующую страницу
            redirectToRolePage(result.user!.role);
          }, 0);
        } else {
          console.error("Ошибка входа:", result.error);

          // При ошибке устанавливаем сообщение об ошибке
          setError(result.error || "Произошла ошибка при входе");
        }
      } catch (error) {
        console.error("Ошибка авторизации:", error);
        setError(
          "Произошла непредвиденная ошибка при входе. Попробуйте позже.",
        );
      }
    },
    [formData, redirectToRolePage],
  );

  /**
   * Инициализирует дефолтных пользователей в системе
   */
  const initializeDefaultUsers = useCallback(() => {
    userService.initializeDefaultUsers();
    if (!localStorage.getItem("projects")) {
      localStorage.setItem("projects", JSON.stringify([]));
    }
  }, []);

  /**
   * Проверяет аутентификацию пользователя и возвращает данные текущего пользователя
   */
  const checkUserAuth = useCallback(() => {
    return sessionService.getCurrentSession();
  }, []);

  /**
   * Выход из системы
   */
  const logout = useCallback(() => {
    sessionService.clearSession();

    // Используем setTimeout для предотвращения обновления состояния во время рендеринга
    setTimeout(() => {
      toast.success("Вы успешно вышли из системы");
      navigate("/login");
    }, 0);
  }, [navigate]);

  // Возвращаем объект с методами и состояниями
  return {
    // Состояния
    formData,
    error,

    // Обработчики формы
    handleInputChange,
    handleRoleChange,
    handleSubmit,

    // Методы аутентификации
    checkExistingSession,
    initializeDefaultUsers,
    checkUserAuth,
    logout,

    // Вспомогательные методы
    setError,
  };
}

// Экспортируем дополнительные типы
export type { User } from "@/services/auth/userService";
