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
 * Парсит строку комментария в объект
 * @param comment Строка или объект комментария
 * @returns Объект с текстом и датой комментария
 */
export function parseComment(comment: any): {
  text: string;
  date: string | null;
} {
  // Проверяем тип комментария
  if (comment === null || comment === undefined) {
    return { text: "", date: null };
  }

  // Если комментарий это строка
  if (typeof comment === "string") {
    return { text: comment, date: null };
  }

  // Если комментарий это объект
  if (typeof comment === "object") {
    try {
      return {
        // Получаем текст комментария, если есть
        text:
          comment.text ||
          (typeof comment.toString === "function" ? comment.toString() : ""),

        // Получаем и форматируем дату, если есть
        date: comment.date ? new Date(comment.date).toLocaleString() : null,
      };
    } catch (error) {
      console.error("Ошибка при парсинге комментария:", error);
      return { text: "Ошибка отображения комментария", date: null };
    }
  }

  // В остальных случаях
  return { text: String(comment), date: null };
}

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
