
import { useState, useEffect } from "react";
import { Project, User } from "@/types/project";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const useDashboardData = (navigate: NavigateFunction) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Загрузка данных пользователя и проектов
  useEffect(() => {
    loadUserAndProjects();
  }, [navigate]);

  // Функция загрузки пользователя и проектов
  const loadUserAndProjects = () => {
    // Загрузка пользователя из localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);

        // Если пользователь не руководитель, перенаправляем на страницу сотрудника
        if (parsedUser.role !== 'manager') {
          navigate('/employee');
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    // Загрузка проектов из localStorage
    const projectsFromStorage = localStorage.getItem('projects');
    if (projectsFromStorage) {
      try {
        const parsedProjects = JSON.parse(projectsFromStorage);
        setProjects(parsedProjects || []);
      } catch (error) {
        console.error("Failed to parse projects data:", error);
        setProjects([]); // Устанавливаем пустой массив в случае ошибки
      }
    } else {
      // Если проектов нет, создаем пустой массив в localStorage
      localStorage.setItem('projects', JSON.stringify([]));
      setProjects([]);
    }
  };

  // Обработчик импорта проектов
  const handleImportProject = (importedProject: Project) => {
    const updatedProjects = [...projects, importedProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success(`Проект "${importedProject.name}" успешно импортирован`);
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
    handleImportProject,
    handleUpdateProject,
    handleDeleteProject,
    handleLogout,
  };
};
