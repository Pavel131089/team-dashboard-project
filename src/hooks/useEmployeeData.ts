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
  // Все состояния объявлены на верхнем уровне, без условий
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

  // Обработка проектов для получения задач - без условных хуков внутри
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
        if (!Array.isArray(projectsList)) {
          console.error("projectsList не является массивом");
          return { userTasks, otherTasks };
        }

        projectsList.forEach((project) => {
          if (!project || !Array.isArray(project.tasks)) {
            return;
          }

          project.tasks.forEach((task) => {
            if (!task) return;

            // Создаем копию задачи с дополнительными полями
            const taskWithProject: TaskWithProject = {
              ...task,
              projectId: project.id,
              projectName: project.name || "Без названия",
              startDate: task.startDate || project.startDate,
              endDate: task.endDate || project.endDate,
              projectStartDate: project.startDate,
              projectEndDate: project.endDate,
            };

            // Проверка назначения задачи текущему пользователю
            let isAssigned = false;

            // Проверяем assignedTo (ID пользователя)
            if (
              task.assignedTo &&
              userData.id &&
              task.assignedTo === userData.id
            ) {
              isAssigned = true;
            }

            // Проверяем assignedToNames (массив имен или ID)
            if (!isAssigned && Array.isArray(task.assignedToNames)) {
              isAssigned = task.assignedToNames.some((name) => {
                if (!name) return false;

                // Приводим значения к строкам для сравнения
                const nameStr = String(name).toLowerCase();
                const userIdStr = userData.id
                  ? String(userData.id).toLowerCase()
                  : "";
                const userNameStr = userData.name
                  ? String(userData.name).toLowerCase()
                  : "";
                const userUsernameStr = userData.username
                  ? String(userData.username).toLowerCase()
                  : "";

                // Проверяем совпадение с любым из идентификаторов пользователя
                return (
                  nameStr === userIdStr ||
                  nameStr === userNameStr ||
                  nameStr === userUsernameStr
                );
              });
            }

            // Добавляем в соответствующий список
            if (isAssigned) {
              userTasks.push(taskWithProject);
            } else {
              otherTasks.push(taskWithProject);
            }
          });
        });
      } catch (error) {
        console.error("Ошибка при обработке проектов:", error);
      }

      return { userTasks, otherTasks };
    },
    [],
  );

  // Загрузка данных пользователя и проектов - вызываем один раз, без условий
  useEffect(() => {
    const loadData = async () => {
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

          // Если у пользователя нет имени, попробуем найти его в таблице пользователей
          if (userData && !userData.name) {
            const usersJson = localStorage.getItem("users");
            if (usersJson) {
              const users = JSON.parse(usersJson);
              if (Array.isArray(users)) {
                const userRecord = users.find((u) => u.id === userData.id);
                if (userRecord && userRecord.name) {
                  userData.name = userRecord.name;
                }
              }
            }
          }
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
          console.log("Загружено проектов:", projectsList.length);

          if (!Array.isArray(projectsList)) {
            console.error("Данные проектов не являются массивом");
            projectsList = [];
          }
        } catch (error) {
          console.error("Ошибка при загрузке проектов:", error);
          projectsList = [];
        }

        setProjects(projectsList);

        // Обработка проектов для получения задач
        try {
          const { userTasks, otherTasks } = processProjects(
            projectsList,
            userData,
          );
          console.log("Задачи пользователя:", userTasks.length);
          console.log("Доступные задачи:", otherTasks.length);

          setAssignedTasks(userTasks);
          setAvailableTasks(otherTasks);
        } catch (error) {
          console.error("Ошибка при обработке задач:", error);
          setAssignedTasks([]);
          setAvailableTasks([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate, processProjects, redirectToLogin]);

  // Остальные функции объявлены с useCallback, чтобы избежать лишних ререндеров

  // Обработчик обновления прогресса задачи
  const handleUpdateTaskProgress = useCallback(
    (taskId: string, projectId: string, progress: number) => {
      try {
        if (!Array.isArray(projects) || projects.length === 0) {
          console.error("Проекты отсутствуют или не являются массивом");
          return false;
        }

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

        const updatedProjects = projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
          }
          return p;
        });

        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setProjects(updatedProjects);

        if (user) {
          const { userTasks, otherTasks } = processProjects(
            updatedProjects,
            user,
          );
          setAssignedTasks(userTasks);
          setAvailableTasks(otherTasks);
        }

        // Перемещаем вызов toast в useEffect или в обработчик событий, а не внутри функции рендеринга
        return true;
      } catch (error) {
        console.error("Ошибка при обновлении прогресса:", error);
        return false;
      }
    },
    [projects, user, processProjects],
  );

  // Используем useEffect для показа уведомлений после выполнения операций
  useEffect(() => {
    // Дополнительный код может быть добавлен здесь для отображения уведомлений
    // после изменения состояния компонента
  }, [assignedTasks, availableTasks]);

  // Обработчик принятия задачи в работу
  const handleTakeTask = useCallback(
    (taskId: string, projectId: string) => {
      if (!user) {
        setTimeout(() => {
          toast.error("Необходимо войти в систему");
        }, 0);
        return false;
      }

      try {
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          setTimeout(() => {
            toast.error("Проект не найден");
          }, 0);
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          setTimeout(() => {
            toast.error("Задача не найдена");
          }, 0);
          return false;
        }

        // Определение существующих значений или инициализация пустыми массивами
        const currentAssignedToNames = Array.isArray(task.assignedToNames)
          ? [...task.assignedToNames]
          : [];

        // Создаем идентификаторы пользователя для проверки
        const userIdentifiers = [user.id, user.name, user.username]
          .filter(Boolean)
          .map((id) => String(id).toLowerCase());

        // Проверяем, не назначена ли задача уже этому пользователю
        const isAlreadyAssigned = currentAssignedToNames.some((name) => {
          if (!name) return false;
          const nameStr = String(name).toLowerCase();
          return userIdentifiers.includes(nameStr);
        });

        if (isAlreadyAssigned) {
          setTimeout(() => {
            toast.info("Эта задача уже назначена вам");
          }, 0);
          return true; // Возвращаем true, т.к. фактически задача уже назначена
        }

        // Подготавливаем идентификатор пользователя для добавления в список
        const userIdentifier = user.name || user.id || user.username;

        // Формируем новый список исполнителей с текущим пользователем
        const newAssignedToNames = [...currentAssignedToNames, userIdentifier];

        console.log("Обновление задачи:", {
          taskId,
          currentAssignedToNames,
          newAssignedToNames,
          userId: user.id,
          userName: user.name,
        });

        // Обновляем задачу
        const updatedTask: Task = {
          ...task,
          assignedTo: user.id,
          assignedToNames: newAssignedToNames,
          actualStartDate: task.actualStartDate || new Date().toISOString(),
        };

        // Обновляем проект с обновленной задачей
        const updatedProjects = projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
          }
          return p;
        });

        // Сохраняем обновленные проекты в localStorage
        localStorage.setItem("projects", JSON.stringify(updatedProjects));

        // Обновляем состояние проектов
        setProjects(updatedProjects);

        // Обрабатываем обновленные проекты для получения списков задач
        const { userTasks, otherTasks } = processProjects(
          updatedProjects,
          user,
        );

        // Обновляем состояния списков задач
        setAssignedTasks(userTasks);
        setAvailableTasks(otherTasks);

        // Показываем уведомление об успешном назначении задачи
        setTimeout(() => {
          toast.success("Задача принята в работу");
        }, 0);

        return true;
      } catch (error) {
        console.error("Ошибка при принятии задачи:", error);
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
        const project = projects.find((p) => p.id === projectId);
        if (!project) {
          console.error("Проект не найден");
          return false;
        }

        const task = project.tasks.find((t) => t.id === taskId);
        if (!task) {
          console.error("Задача не найдена");
          return false;
        }

        const newComment = {
          id: `comment-${Date.now()}`,
          text: commentText,
          author: user.name || "Сотрудник",
          date: new Date().toISOString(),
        };

        const updatedTask: Task = {
          ...task,
          comments: [
            ...(Array.isArray(task.comments) ? task.comments : []),
            newComment,
          ],
        };

        const updatedProjects = projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            };
          }
          return p;
        });

        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setProjects(updatedProjects);

        const { userTasks, otherTasks } = processProjects(
          updatedProjects,
          user,
        );
        setAssignedTasks(userTasks);
        setAvailableTasks(otherTasks);

        return true;
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
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
    projects,
    isLoading,
    handleTakeTask,
    handleUpdateTaskProgress,
    handleAddTaskComment,
    handleLogout,
  };
}
