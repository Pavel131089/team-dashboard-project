import { useState, useEffect } from "react";
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
  }, [navigate]);

  // Функция загрузки пользователя и проектов
  const loadUserAndProjects = () => {
    setIsLoading(true);
    // Загрузка пользователя из localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        
        // Проверяем, что пользователь аутентифицирован
        if (!parsedUser.isAuthenticated) {
          redirectToLogin("Сессия истекла. Пожалуйста, войдите снова.");
          return;
        }
        
        setUser(parsedUser);

        // Если пользователь не руководитель, перенаправляем на страницу сотрудника
        if (parsedUser.role !== 'manager') {
          navigate('/employee');
          return;
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        redirectToLogin("Проблема с данными сессии. Пожалуйста, войдите снова.");
        return;
      }
    } else {
      redirectToLogin();
      return;
    }

    // Загрузка проектов из localStorage
    loadProjects();
    setIsLoading(false);
  };

  // Функция загрузки проектов
  const loadProjects = () => {
    try {
      const projectsFromStorage = localStorage.getItem('projects');
      if (projectsFromStorage) {
        const parsedProjects = JSON.parse(projectsFromStorage);
        
        // Добавляем проверку на корректность данных
        if (Array.isArray(parsedProjects)) {
          console.log("Загружено проектов:", parsedProjects.length);
          setProjects(parsedProjects);
        } else {
          console.error("Данные проектов не являются массивом:", parsedProjects);
          setProjects([]);
          // Инициализируем хранилище с пустым массивом
          localStorage.setItem('projects', JSON.stringify([]));
        }
      } else {
        // Если проектов нет, создаем пустой массив в localStorage
        console.log("Проекты не найдены в хранилище, создаем пустой массив");
        localStorage.setItem('projects', JSON.stringify([]));
        setProjects([]);
      }
    } catch (error) {
      console.error("Произошла ошибка при загрузке проектов:", error);
      // В случае ошибки устанавливаем пустой массив
      setProjects([]);
      localStorage.setItem('projects', JSON.stringify([]));
    }
  };

  // Вспомогательная функция для перенаправления на страницу входа
  const redirectToLogin = (message?: string) => {
    if (message) {
      // Устанавливаем сообщение для отображения на странице входа
      sessionStorage.setItem('auth_message', message);
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Обработчик импорта проектов
  const handleImportProject = (importedProject: Project) => {
    // Проверяем существующие проекты перед добавлением
    const updatedProjects = [...projects, importedProject];
    setProjects(updatedProjects);
    
    // Сохраняем обновленный массив в localStorage
    try {
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      toast.success(`Проект "${importedProject.name}" успешно импортирован`);
    } catch (error) {
      console.error("Ошибка при сохранении проектов:", error);
      toast.error("Не удалось сохранить проект. Проверьте хранилище браузера.");
    }
  };

  // Обработчик обновления проекта
  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Обработчик удаления проекта
  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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