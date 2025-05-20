
import { Task } from "@/types/project";

/**
 * Проверяет, есть ли у задачи комментарии
 * @param task Задача для проверки
 * @returns true, если у задачи есть комментарии
 */
export const hasComments = (task: Task): boolean => {
  return Boolean(task.comments && task.comments.length > 0);
};

/**
 * Добавляет комментарий к задаче
 * @param task Исходная задача
 * @param commentText Текст комментария
 * @returns Обновленная задача с новым комментарием
 */
export const addCommentToTask = (task: Task, commentText: string): Task => {
  if (!commentText.trim()) return task;

  const timestamp = new Date().toISOString();
  const commentWithTimestamp = `${timestamp}: ${commentText}`;

  const updatedComments = task.comments 
    ? [...task.comments, commentWithTimestamp] 
    : [commentWithTimestamp];
    
  return {
    ...task,
    comments: updatedComments,
  };
};
