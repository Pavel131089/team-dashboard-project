import { useState, useEffect, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { toast } from "sonner";

// Интерфейс для задачи с информацией о проекте
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

  // Функция для перенаправления на страницу входа
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

  // Обработка проектов для получения задач
  const processProjects = useCallback(
    (
      projectsList: Project[],
      userData: User,
    ): {
      userTasks: TaskWithProject[];
      otherTasks: TaskWithProject[];
    } => {
      const userTasks: TaskWithProject[] = [];
      const otherTasks: TaskWithProject[] = [];

      try {
        // Проверяем, что projectsList - массив
        if (!Array.isArray(projectsList)) {
          console.error("projectsList не является массивом");
          return { userTasks, otherTasks };
        }

        // Проверяем даты проектов и их задач
        const projectsWithDates = projectsList.map((project) => {
          console.log(`Проект ${project.name}:`, {
            id: project.id,
            startDate: project.startDate,
            endDate: project.endDate,
            tasksCount: project.tasks?.length || 0,
          });

          // Проверяем задачи проекта на наличие дат
          if (project.tasks && project.tasks.length > 0) {
            project.tasks.forEach((task) => {
              console.log(`  Задача ${task.name}:`, {
                id: task.id,
                startDate: task.startDate,
                endDate: task.endDate,
              });
            });
          }

          return project;
        });

        projectsList.forEach((project) => {
          // Проверяем, что project существует и tasks - массив
          if (!project || !Array.isArray(project.tasks)) {
            return;
          }

          project.tasks.forEach((task) => {
            // Проверяем, что task существует
            if (!task) return;

            // Создаем копию задачи с дополнительными полями
            const taskWithProject: TaskWithProject = {
              ...task,
              projectId: project.id,
              projectName: project.name || "Без названия",
              // Очень важно: явно передаем даты проекта для каждой задачи
              projectStartDate: project.startDate,
              projectEndDate: project.endDate,
            };

            // Проверка назначения задачи текущему пользователю
            let isAssigned = false;

            // Проверяем по ID пользователя
            if (
              task.assignedTo &&
              userData.id &&
              task.assignedTo === userData.id
            ) {
              isAssigned = true;
            }

            // Проверяем по имени, имени пользователя или email
            if (!isAssigned && Array.isArray(task.assignedToNames)) {
              isAssigned = task.assignedToNames.some((name) => {
                if (!name) return false;

                const nameStr = String(name).toLowerCase();
                const userName = userData.name
                  ? String(userData.name).toLowerCase()
                  : "";
                const userUsername = userData.username
                  ? String(userData.username).toLowerCase()
                  : "";
                const userEmail = userData.email
                  ? String(userData.email).toLowerCase()
                  : "";

                return (
                  nameStr === userName ||
                  nameStr === userUsername ||
                  nameStr === userEmail
                );
              });
            }

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

        // Отладка: проверяем, что даты проекта корректно передаются в доступные задачи
        if (otherTasks.length > 0) {
          console.log(
            "Доступные задачи с информацией о датах:",
            otherTasks.slice(0, 3).map((task) => ({
              id: task.id,
              name: task.name,
              startDate: task.startDate,
              endDate: task.endDate,
              projectId: task.projectId,
              projectName: task.projectName,
              projectStartDate: task.projectStartDate,
              projectEndDate: task.projectEndDate,
            })),
          );
        }
      } catch (error) {
        console.error("Ошибка при обработке проектов:", error);
      }

      return { userTasks, otherTasks };
    },
    [],
  );

  // Загрузка данных пользователя и проектов
  useEffect(() => {
    // Функция для загрузки пользователя и проектов
    const loadData = () => {
      setIsLoading(true);
      try {
        // Загрузка пользователя из localStorage
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          redirectToLogin();
          return;
        }

        let userData;
        try {
          userData = JSON.parse(userJson);
        } catch (error) {
          console.error("Ошибка при парсинге данных пользователя:", error);
          redirectToLogin("Проблема с данными пользователя");
          return;
        }

        if (!userData || !userData.isAuthenticated) {
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
        let projectsList = [];
        try {
          const projectsData = localStorage.getItem("projects");
          projectsList = projectsData ? JSON.parse(projectsData) : [];

          // Проверяем, что projectsList действительно массив
          if (!Array.isArray(projectsList)) {
            console.error("Данные проектов не являются массивом");
            projectsList = [];
          }

          // Отладка проектов для проверки дат
          console.log(
            "Loaded projects:",
            projectsList.map((p) => ({
              id: p.id,
              name: p.name,
              startDate: p.startDate,
              endDate: p.endDate,
            })),
          );
        } catch (error) {
          console.error("Ошибка при загрузке проектов:", error);
          projectsList = [];
        }

        setProjects(projectsList);

        // Обработка проектов для получения задач
        const processedTasks = processProjects(projectsList, userData);

        // Отладка задач для проверки, что даты были добавлены
        console.log("Processed tasks:", {
          userTasks: processedTasks.userTasks.map((t) => ({
            id: t.id,
            name: t.name,
            projectId: t.projectId,
            startDate: t.startDate,
            endDate: t.endDate,
            projectStartDate: t.projectStartDate,
            projectEndDate: t.projectEndDate,
          })),
          availableTasks: processedTasks.otherTasks.map((t) => ({
            id: t.id,
            name: t.name,
            projectId: t.projectId,
            startDate: t.startDate,
            endDate: t.endDate,
            projectStartDate: t.projectStartDate,
            projectEndDate: t.projectEndDate,
          })),
        });

        setAssignedTasks(processedTasks.userTasks);
        setAvailableTasks(processedTasks.otherTasks);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        // Перемещаем вызов toast в setTimeout, чтобы избежать обновления состояния во время рендеринга
        setTimeout(() => {
          toast.error("Произошла ошибка при загрузке данных");
        }, 0);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, processProjects, redirectToLogin]);

  // Обработчик обновления прогресса задачи
  const handleUpdateTaskProgress = useCallback(
    (taskId: string, projectId: string, progress: number) => {
      try {
        // Проверяем, что у нас есть валидные проекты
        if (!Array.isArray(projects) || projects.length === 0) {
          console.error("Проекты отсутствуют или не являются массивом");
          return false;
        }

        // Находим проект и задачу
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          console.error(`Проект с ID ${projectId} не найден`);
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          console.error(`Задача с ID ${taskId} не найдена`);
          return false;
        }

        // Обновляем данные задачи
        const updatedTask: Task = {
          ...task,
          progress,
          actualStartDate: task.actualStartDate || new Date().toISOString(),
          // Если прогресс 100%, устанавливаем дату завершения, иначе убираем её
          actualEndDate:
            progress === 100
              ? task.actualEndDate || new Date().toISOString()
              : progress < 100
                ? null
                : task.actualEndDate,
        };

        // Создаем новый массив проектов с обновленной задачей
        const updatedProjects = projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
          }
          return p;
        });

        // Сохраняем изменения в localStorage
        localStorage.setItem("projects", JSON.stringify(updatedProjects));

        // Обновляем состояние проектов
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

        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.success(`Прогресс обновлен: ${progress}%`);
        }, 0);

        return true;
      } catch (error) {
        console.error("Ошибка при обновлении прогресса:", error);

        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.error("Ошибка при обновлении прогресса");
        }, 0);

        return false;
      }
    },
    [projects, user, processProjects],
  );

  // Обработчик принятия задачи в работу
  const handleTakeTask = useCallback(
    (taskId: string, projectId: string) => {
      if (!user) {
        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.error("Необходимо войти в систему");
        }, 0);
        return false;
      }

      try {
        // Находим проект и задачу
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          // Используем отложенный вызов toast вместо прямого
          setTimeout(() => {
            toast.error("Проект не найден");
          }, 0);
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          // Используем отложенный вызов toast вместо прямого
          setTimeout(() => {
            toast.error("Задача не найдена");
          }, 0);
          return false;
        }

        // Обновляем данные задачи
        const updatedTask: Task = {
          ...task,
          assignedTo: user.id,
          assignedToNames: [...(task.assignedToNames || []), user.name],
          actualStartDate: task.actualStartDate || new Date().toISOString(),
        };

        // Обновляем проекты
        const updatedProjects = projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
          }
          return p;
        });

        // Сохраняем изменения в localStorage
        localStorage.setItem("projects", JSON.stringify(updatedProjects));

        // Обновляем состояние проектов
        setProjects(updatedProjects);

        // Обновляем списки задач
        const { userTasks, otherTasks } = processProjects(
          updatedProjects,
          user,
        );
        setAssignedTasks(userTasks);
        setAvailableTasks(otherTasks);

        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.success("Задача принята в работу");
        }, 0);

        return true;
      } catch (error) {
        console.error("Ошибка при принятии задачи:", error);

        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.error("Ошибка при принятии задачи");
        }, 0);

        return false;
      }
    },
    [projects, user, processProjects],
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
          // Используем отложенный вызов toast вместо прямого
          setTimeout(() => {
            toast.error("Проект не найден");
          }, 0);
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          // Используем отложенный вызов toast вместо прямого
          setTimeout(() => {
            toast.error("Задача не найдена");
          }, 0);
          return false;
        }

        // Создаем новый комментарий
        const newComment = {
          id: `comment-${Date.now()}`,
          text: commentText,
          author: user.name || "Сотрудник",
          date: new Date().toISOString(),
        };

        // Обновляем данные задачи
        const updatedTask: Task = {
          ...task,
          comments: [
            ...(Array.isArray(task.comments) ? task.comments : []),
            newComment,
          ],
        };

        // Обновляем проекты
        const updatedProjects = projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
          }
          return p;
        });

        // Сохраняем изменения в localStorage
        localStorage.setItem("projects", JSON.stringify(updatedProjects));

        // Обновляем состояние проектов
        setProjects(updatedProjects);

        // Обновляем списки задач
        const { userTasks, otherTasks } = processProjects(
          updatedProjects,
          user,
        );
        setAssignedTasks(userTasks);
        setAvailableTasks(otherTasks);

        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.success("Комментарий добавлен");
        }, 0);

        return true;
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);

        // Используем отложенный вызов toast вместо прямого
        setTimeout(() => {
          toast.error("Ошибка при добавлении комментария");
        }, 0);

        return false;
      }
    },
    [projects, user, processProjects],
  );

  // Выход из системы
  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

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
