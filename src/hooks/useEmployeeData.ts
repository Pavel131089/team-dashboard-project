import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { useAuth } from "./useAuth";
import { useUserTasks } from "./useUserTasks";
import { useProjectTasks } from "./useProjectTasks";
import {
  getProjectsFromStorage,
  initializeProjectsStorage,
} from "@/utils/storageUtils";

/**
 * Основной хук для управления данными сотрудника
 */
export function useEmployeeData(navigate: NavigateFunction) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Инициализируем хуки
  const { checkUserAuth, logout } = useAuth(navigate);
  const { userTasks } = useUserTasks(user, projects, userName);
  const { updateTask } = useProjectTasks(projects, userTasks);

  // Загрузка данных пользователя и проектов при первом рендере
  useEffect(() => {
    loadUserAndProjects();
  }, [navigate]);

  /**
   * Загружает пользователя и проекты
   */
  const loadUserAndProjects = () => {
    setIsLoading(true);

    // Проверяем авторизацию и получаем пользователя
    const currentUser = checkUserAuth();
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setUser(currentUser);
    setUserName(currentUser.username || "");

    // Загрузка проектов
    loadProjects();
    setIsLoading(false);
  };

  /**
   * Загружает проекты из localStorage
   */
  const loadProjects = () => {
    const loadedProjects = getProjectsFromStorage();
    setProjects(loadedProjects);

    // Инициализируем хранилище проектов, если его нет
    initializeProjectsStorage();
  };

  /**
   * Обертка для обновления задачи
   */
  const handleTaskUpdate = (projectId: string, task: Task) => {
    if (user) {
      updateTask(projectId, task, user.id);
    }
  };

  return {
    user,
    projects,
    userTasks,
    isLoading,
    handleTaskUpdate,
    handleLogout: logout,
  };
}
