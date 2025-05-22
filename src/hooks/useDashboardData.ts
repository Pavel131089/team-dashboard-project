import { useState, useEffect, useCallback } from "react";
import { Project, User } from "@/types/project";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const useDashboardData = (navigate: NavigateFunction) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных пользователя и проектов
  useEffect(() => {
    loadUserAndProjects();
  }, []);

  // Функция для перенаправления на страницу входа
  const redirectToLogin = useCallback(
    (message?: string) => {
      if (message) {
        // Устанавливаем сообщение для отображения на странице входа
        sessionStorage.setItem("auth_message", message);
      }
      localStorage.removeItem("user");
      navigate("/login");
    },
    [navigate],
  );

  // Функция загрузки пользователя и проектов
  const loadUserAndProjects = useCallback(() => {
    setIsLoading(true);
    // Загрузка пользователя из localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);

        // Проверяем, что пользователь аутентифицирован
        if (!parsedUser.isAuthenticated) {
          // Используем отложенный вызов для предотвращения обновления во время рендеринга
          setTimeout(() => {
            redirectToLogin("Сессия истекла. Пожалуйста, войдите снова.");
          }, 0);
          return;
        }

        // Если у пользователя нет имени, попробуем найти его в таблице пользователей
        if (!parsedUser.name) {
          const usersJson = localStorage.getItem("users");
          if (usersJson) {
            const users = JSON.parse(usersJson);
            if (Array.isArray(users)) {
              const userRecord = users.find((u) => u.id === parsedUser.id);
              if (userRecord && userRecord.name) {
                parsedUser.name = userRecord.name;
              }
            }
          }
        }

        setUser(parsedUser);

        // Если пользователь не руководитель, перенаправляем на страницу сотрудника
        if (parsedUser.role !== "manager") {
          // Используем отложенный вызов для предотвращения обновления во время рендеринга
          setTimeout(() => {
            navigate("/employee");
          }, 0);
          return;
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        // Используем отложенный вызов для предотвращения обновления во время рендеринга
        setTimeout(() => {
          redirectToLogin(
            "Проблема с данными сессии. Пожалуйста, войдите снова.",
          );
        }, 0);
        return;
      }
    } else {
      // Используем отложенный вызов для предотвращения обновления во время рендеринга
      setTimeout(() => {
        redirectToLogin();
      }, 0);
      return;
    }

    // Загрузка проектов из localStorage
    loadProjects();
    setIsLoading(false);
  }, [navigate, redirectToLogin]);

  // Функция загрузки проектов
  const loadProjects = useCallback(() => {
    try {
      const projectsFromStorage = localStorage.getItem("projects");
      if (projectsFromStorage) {
        const parsedProjects = JSON.parse(projectsFromStorage);

        // Добавляем проверку на корректность данных
        if (Array.isArray(parsedProjects)) {
          console.log("Загружено проектов:", parsedProjects.length);
          setProjects(parsedProjects);
        } else {
          console.error(
            "Данные проектов не являются массивом:",
            parsedProjects,
          );
          setProjects([]);
          // Инициализируем хранилище с пустым массивом
          localStorage.setItem("projects", JSON.stringify([]));
        }
      } else {
        // Если проектов нет, создаем пустой массив в localStorage
        console.log("Проекты не найдены в хранилище, создаем пустой массив");
        localStorage.setItem("projects", JSON.stringify([]));
        setProjects([]);
      }
    } catch (error) {
      console.error("Произошла ошибка при загрузке проектов:", error);
      // В случае ошибки устанавливаем пустой массив
      setProjects([]);
      localStorage.setItem("projects", JSON.stringify([]));
    }
  }, []);

  // Обработчик импорта проектов
  const handleImportProject = useCallback(
    (importedProject: Project) => {
      // Проверяем существующие проекты перед добавлением
      const updatedProjects = [...projects, importedProject];
      setProjects(updatedProjects);

      // Сохраняем обновленный массив в localStorage
      try {
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        // Используем setTimeout для предотвращения обновления состояния во время рендеринга
        setTimeout(() => {
          toast.success(
            `Проект "${importedProject.name}" успешно импортирован`,
          );
        }, 0);
      } catch (error) {
        console.error("Ошибка при сохранении проектов:", error);
        // Используем setTimeout для предотвращения обновления состояния во время рендеринга
        setTimeout(() => {
          toast.error(
            "Не удалось сохранить проект. Проверьте хранилище браузера.",
          );
        }, 0);
      }
    },
    [projects],
  );

  // Обработчик обновления проекта
  const handleUpdateProject = useCallback((updatedProject: Project) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      );
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      return updatedProjects;
    });
  }, []);

  // Обработчик удаления проекта
  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.filter(
        (project) => project.id !== projectId,
      );
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      return updatedProjects;
    });
  }, []);

  // Обработчик выхода из системы
  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  return {
    projects,
    user,
    isLoading,
    handleImportProject,
    handleUpdateProject,
    handleDeleteProject,
    handleLogout,
  };
};
