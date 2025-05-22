import { useState, useEffect, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { Project, Task, User, TaskComment } from "@/types/project";
import {
  getProjectsFromStorage,
  saveProjectsToStorage,
} from "@/utils/storageUtils";
import { toast } from "sonner";

// Расширенный интерфейс задачи с информацией о проекте
interface TaskWithProject extends Task {
  projectId: string;
  projectName: string;
}

/**
 * Хук для работы с данными сотрудника
 */
export function useEmployeeData(navigate: NavigateFunction) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<TaskWithProject[]>([]);
  const [availableTasks, setAvailableTasks] = useState<TaskWithProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных пользователя и проектов
  useEffect(() => {
    loadUserAndProjects();
  }, [navigate]);

  // Загружаем пользователя и проекты из хранилища
  const loadUserAndProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Загрузка пользователя из localStorage
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        redirectToLogin();
        return;
      }

      const userData = JSON.parse(userJson);
      if (!userData.isAuthenticated) {
        redirectToLogin("Сессия истекла. Пожалуйста, войдите снова.");
        return;
      }

      // Проверяем роль пользователя
      if (userData.role === "manager") {
        navigate("/dashboard");
        return;
      }

      setUser(userData);

      // Загрузка проектов
      const projectsList = getProjectsFromStorage();
      setProjects(projectsList);

      // Обработка проектов для получения задач
      const { userTasks, otherTasks } = processProjects(projectsList, userData);
      setAssignedTasks(userTasks);
      setAvailableTasks(otherTasks);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      toast.error("Произошла ошибка при загрузке данных");
      redirectToLogin("Ошибка загрузки данных. Пожалуйста, войдите снова.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Перенаправление на страницу входа
  const redirectToLogin = useCallback(
    (message?: string) => {
      if (message) {
        sessionStorage.setItem("auth_message", message);
      }
      localStorage.removeItem("user");
      navigate("/login");
    },
    [navigate],
  );

  // Выход из системы
  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  // Обработка проектов для получения задач
  const processProjects = (
    projectsList: Project[],
    userData: User,
  ): {
    userTasks: TaskWithProject[];
    otherTasks: TaskWithProject[];
  } => {
    const userTasks: TaskWithProject[] = [];
    const otherTasks: TaskWithProject[] = [];

    if (!Array.isArray(projectsList)) {
      console.error("Проекты не являются массивом:", projectsList);
      return { userTasks, otherTasks };
    }

    projectsList.forEach((project) => {
      if (!project || !project.tasks || !Array.isArray(project.tasks)) {
        console.log("Пропускаем некорректный проект:", project);
        return;
      }

      project.tasks.forEach((task) => {
        if (!task) return;

        const taskWithProject: TaskWithProject = {
          ...task,
          projectId: project.id,
          projectName: project.name,
        };

        // Проверяем, назначена ли задача текущему пользователю
        const isAssigned =
          (userData && task.assignedTo === userData.id) ||
          (userData &&
            task.assignedToNames &&
            Array.isArray(task.assignedToNames) &&
            task.assignedToNames.some(
              (name) =>
                name === userData.name ||
                name === userData.username ||
                name === userData.email,
            ));

        if (isAssigned) {
          userTasks.push(taskWithProject);
        } else if (
          !task.assignedTo &&
          (!task.assignedToNames || task.assignedToNames.length === 0)
        ) {
          // Если задача не назначена никому, она доступна
          otherTasks.push(taskWithProject);
        }
      });
    });

    return { userTasks, otherTasks };
  };

  // Обновление задачи
  const updateProjectTask = useCallback(
    (projectId: string, updatedTask: Task): boolean => {
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task,
            ),
          };
        }
        return project;
      });

      saveProjectsToStorage(updatedProjects);
      setProjects(updatedProjects);

      // Обновляем списки задач
      if (user) {
        const { userTasks, otherTasks } = processProjects(
          updatedProjects,
          user,
        );
        setAssignedTasks(userTasks);
        setAvailableTasks(otherTasks);
      }

      return true;
    },
    [projects, user],
  );

  // Обработчик принятия задачи в работу
  const handleTakeTask = useCallback(
    (taskId: string, projectId: string) => {
      if (!user) {
        toast.error("Необходимо войти в систему");
        return false;
      }

      try {
        // Находим проект и задачу
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          toast.error("Проект не найден");
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          toast.error("Задача не найдена");
          return false;
        }

        // Обновляем данные задачи
        const updatedTask: Task = {
          ...task,
          assignedTo: user.id,
          assignedToNames: [...(task.assignedToNames || []), user.name],
          actualStartDate: task.actualStartDate || new Date().toISOString(),
        };

        // Обновляем задачу в проекте
        const success = updateProjectTask(projectId, updatedTask);
        if (success) {
          toast.success("Задача принята в работу");
        }
        return success;
      } catch (error) {
        console.error("Ошибка при принятии задачи:", error);
        toast.error("Ошибка при принятии задачи");
        return false;
      }
    },
    [projects, user, updateProjectTask],
  );

  // Обработчик обновления прогресса задачи
  const handleUpdateTaskProgress = useCallback(
    (taskId: string, projectId: string, progress: number) => {
      try {
        // Находим проект и задачу
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          toast.error("Проект не найден");
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          toast.error("Задача не найдена");
          return false;
        }

        // Обновляем данные задачи
        const updatedTask: Task = {
          ...task,
          progress,
          actualStartDate: task.actualStartDate || new Date().toISOString(),
          actualEndDate:
            progress === 100
              ? task.actualEndDate || new Date().toISOString()
              : progress < 100
                ? null
                : task.actualEndDate,
        };

        // Обновляем задачу в проекте
        const success = updateProjectTask(projectId, updatedTask);
        if (success) {
          toast.success(`Прогресс обновлен: ${progress}%`);
        }
        return success;
      } catch (error) {
        console.error("Ошибка при обновлении прогресса:", error);
        toast.error("Ошибка при обновлении прогресса");
        return false;
      }
    },
    [projects, updateProjectTask],
  );

  // Обработчик добавления комментария к задаче
  const handleAddTaskComment = useCallback(
    (taskId: string, projectId: string, commentText: string) => {
      if (!user || !commentText.trim()) {
        return false;
      }

      try {
        // Находим проект и задачу
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          toast.error("Проект не найден");
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          toast.error("Задача не найдена");
          return false;
        }

        // Создаем новый комментарий
        const newComment: TaskComment = {
          id: `comment-${Date.now()}`,
          text: commentText,
          author: user.name,
          date: new Date().toISOString(),
        };

        // Обновляем данные задачи
        const updatedTask: Task = {
          ...task,
          comments: [...(task.comments || []), newComment],
        };

        // Обновляем задачу в проекте
        const success = updateProjectTask(projectId, updatedTask);
        if (success) {
          toast.success("Комментарий добавлен");
        }
        return success;
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
        toast.error("Ошибка при добавлении комментария");
        return false;
      }
    },
    [projects, user, updateProjectTask],
  );

  return {
    user,
    assignedTasks,
    availableTasks,
    isLoading,
    handleTakeTask,
    handleUpdateTaskProgress,
    handleAddTaskComment,
    handleLogout,
  };
}
