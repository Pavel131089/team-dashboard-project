import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth/authService";
import { sessionService } from "@/services/auth/sessionService";
import { userService } from "@/services/auth/userService";
import { storageUtils } from "@/utils/storage";

// Типы данных
export type UserRole = "manager" | "employee";

export interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

/**
 * Хук для управления аутентификацией пользователя
 *
 * Предоставляет функциональность для:
 * - Входа в систему
 * - Выхода из системы
 * - Управления формой авторизации
 * - Инициализации базовых пользователей
 */
export function useAuth(navigateTo?: string) {
  // Состояние формы входа
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    role: "employee",
  });

  // Состояние ошибки
  const [error, setError] = useState<string | null>(null);

  // Хук для навигации
  const navigate = useNavigate();

  /**
   * Обработчик изменения полей ввода
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Обработчик изменения роли пользователя
   */
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  /**
   * Перенаправляет пользователя в зависимости от роли
   */
  const redirectToRolePage = (role: UserRole) => {
    const targetPath = role === "manager" ? "/dashboard" : "/employee";
    const path = navigateTo || targetPath;
    navigate(path);
  };

  /**
   * Проверяет существующую сессию пользователя
   * Если сессия найдена, перенаправляет на соответствующую страницу
   */
  const checkExistingSession = () => {
    try {
      // Получаем текущую сессию
      const session = sessionService.getCurrentSession();

      // Если сессия существует и пользователь аутентифицирован
      if (session && session.isAuthenticated) {
        redirectToRolePage(session.role);
        return true;
      }

      // Проверяем наличие сообщения об ошибке
      const errorMessage = sessionService.getErrorMessage();
      if (errorMessage) {
        setError(errorMessage);
      }

      return false;
    } catch (error) {
      console.error("Ошибка при проверке сессии:", error);
      sessionService.clearSession();
      return false;
    }
  };

  /**
   * Обработчик отправки формы входа
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация формы
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      console.log("Отправка формы авторизации:", formData);

      // Попытка авторизации
      const result = authService.login(formData);

      if (result.success && result.user) {
        console.log("Успешный вход:", result.user);

        // При успешном входе показываем уведомление
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${result.user.name}!`,
        });

        // Перенаправляем на соответствующую страницу
        redirectToRolePage(result.user.role);
      } else {
        console.error("Ошибка входа:", result.error);

        // При ошибке устанавливаем сообщение об ошибке
        setError(result.error || "Произошла ошибка при входе");
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setError("Произошла непредвиденная ошибка при входе. Попробуйте позже.");
    }
  };

  /**
   * Инициализирует дефолтных пользователей в системе
   */
  const initializeDefaultUsers = () => {
    userService.initializeDefaultUsers();
    storageUtils.initializeStorage("projects", []);
  };

  /**
   * Проверяет аутентификацию пользователя и возвращает данные текущего пользователя
   */
  const checkUserAuth = () => {
    return sessionService.getCurrentSession();
  };

  /**
   * Выход из системы
   */
  const logout = () => {
    sessionService.clearSession();

    // Уведомление о выходе
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы",
    });

    navigate("/login");
  };

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
