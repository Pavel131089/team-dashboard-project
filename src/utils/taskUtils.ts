import { Project, Task } from "@/types/project";

/**
 * Утилиты для работы с задачами
 */

/**
 * Обновляет задачу в списке проектов
 * @returns Обновленный массив проектов
 */
export const updateTaskInProjects = (
  projects: Project[],
  projectId: string,
  updatedTask: Task,
): Project[] => {
  return projects.map((project) => {
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
};

/**
 * Обновляет список задач пользователя после обновления задачи
 */
export const updateUserTasksList = (
  userTasks: { project: Project; task: Task }[],
  projectId: string,
  updatedTask: Task,
  updatedProjects: Project[],
) => {
  return userTasks.map((item) => {
    if (item.project.id === projectId && item.task.id === updatedTask.id) {
      return {
        project: updatedProjects.find((p) => p.id === projectId)!,
        task: updatedTask,
      };
    }
    return item;
  });
};

/**
 * Удаляет задачу из списка задач пользователя
 */
export const removeTaskFromUserTasks = (
  userTasks: { project: Project; task: Task }[],
  projectId: string,
  taskId: string,
) => {
  return userTasks.filter(
    (item) => !(item.project.id === projectId && item.task.id === taskId),
  );
};

/**
 * Обновляет assignedTo в задаче, удаляя указанного пользователя
 */
export const removeUserFromTaskAssignees = (
  task: Task,
  userId: string,
): Task => {
  let newAssignedTo = task.assignedTo;

  if (Array.isArray(newAssignedTo)) {
    newAssignedTo = newAssignedTo.filter((id) => id !== userId);
    // Если остался только 1 исполнитель, преобразуем массив в строку
    if (newAssignedTo.length === 1) {
      newAssignedTo = newAssignedTo[0];
    } else if (newAssignedTo.length === 0) {
      newAssignedTo = null;
    }
  } else {
    newAssignedTo = null;
  }

  return {
    ...task,
    assignedTo: newAssignedTo,
  };
};

/**
 * Обновляет дату окончания задачи, если она завершена
 */
export const updateTaskCompletionDate = (task: Task): Task => {
  if (task.progress === 100 && !task.actualEndDate) {
    return {
      ...task,
      actualEndDate: new Date().toISOString(),
    };
  }

  return task;
};

/**
 * Проверяет, есть ли у задачи комментарии
 * @param task Объект задачи
 * @returns true, если у задачи есть хотя бы один комментарий
 */
export const hasTaskComments = (task: Task): boolean => {
  return Boolean(task.comments && task.comments.length > 0);
};

/**
 * Парсит комментарий на дату и текст
 * @param comment Строка комментария в формате "timestamp: текст"
 * @returns Объект с разобранными данными комментария
 */
export const parseTaskComment = (
  comment: string,
): { date: string; text: string } => {
  // Формат: "2023-05-16T12:34:56.789Z: текст комментария"
  const match = comment.match(/^([^:]+):\s*(.*)/);
  if (match && match.length >= 3) {
    try {
      const dateStr = match[1].trim();
      const text = match[2].trim();
      return {
        date: formatCommentDate(dateStr),
        text: text,
      };
    } catch (e) {
      console.warn("Error parsing comment:", e);
      return { date: "", text: comment };
    }
  }
  return { date: "", text: comment };
};
