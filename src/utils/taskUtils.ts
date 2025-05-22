import { Task } from "@/types/project";

/**
 * Проверяет, есть ли у задачи комментарии
 * @param task Задача для проверки
 * @returns true если у задачи есть комментарии
 */
export const hasTaskComments = (task: Task): boolean => {
  return Boolean(task.comments && task.comments.length > 0);
};

/**
 * Добавляет комментарий к задаче
 * @param task Задача
 * @param commentText Текст комментария
 * @param userName Имя пользователя (опционально)
 * @returns Обновленная задача с новым комментарием
 */
export const addCommentToTask = (
  task: Task,
  commentText: string,
  userName: string = "Сотрудник",
): Task => {
  const date = new Date().toISOString();
  const formattedComment = `${date}|${userName}: ${commentText}`;

  return {
    ...task,
    comments: task.comments
      ? [...task.comments, formattedComment]
      : [formattedComment],
  };
};

/**
 * Разбирает комментарий на дату и текст
 * @param comment Строка комментария
 * @returns Объект с датой и текстом комментария
 */
export const parseComment = (
  comment: string,
): { date: string; text: string } => {
  const parts = comment.split("|");

  if (parts.length < 2) {
    return { date: "", text: comment };
  }

  try {
    const dateStr = parts[0];
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleString();

    return {
      date: formattedDate,
      text: parts.slice(1).join("|"),
    };
  } catch (error) {
    return { date: "", text: comment };
  }
};

/**
 * Проверяет, есть ли у задачи комментарии
 * Псевдоним для hasTaskComments для обратной совместимости
 */
export const hasComments = hasTaskComments;

/**
 * Проверяет, может ли пользователь взять задачу в работу
 * @param task Задача для проверки
 * @param userId ID пользователя
 * @returns true если пользователь может взять задачу в работу
 */
export const canUserTakeTask = (task: Task, userId: string): boolean => {
  // Проверяем, назначена ли задача уже этому пользователю
  if (task.assignedTo === userId) {
    return false;
  }

  // Проверяем в массиве assignedToNames
  if (
    Array.isArray(task.assignedToNames) &&
    task.assignedToNames.includes(userId)
  ) {
    return false;
  }

  // В остальных случаях пользователь может взять задачу
  return true;
};
