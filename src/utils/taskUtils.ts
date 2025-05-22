
import { Task } from "@/types/project";

/**
 * Проверяет, есть ли комментарии в задаче
 * @param task задача для проверки
 * @returns true, если есть комментарии
 */
export const hasTaskComments = (task?: Task): boolean => {
  if (!task) return false;
  return Array.isArray(task.comments) && task.comments.length > 0;
};

/**
 * Извлекает дату и текст из комментария в формате "[Дата] Текст"
 * @param comment строка комментария
 * @returns объект с датой и текстом
 */
export const parseComment = (comment: string | any): { date: string | null; text: string } => {
  if (!comment) return { date: null, text: "" };
  
  // Если это объект с полями date и text или author, text
  if (typeof comment === 'object') {
    if (comment.date && comment.text) {
      return { 
        date: formatCommentDate(comment.date), 
        text: comment.text 
      };
    }
    if (comment.author && comment.text) {
      return { 
        date: comment.date ? formatCommentDate(comment.date) : null, 
        text: `${comment.author}: ${comment.text}` 
      };
    }
  }
  
  // Если это строка
  if (typeof comment === 'string') {
    // Пробуем найти дату в квадратных скобках
    const match = comment.match(/^\[(.*?)\](.*)/);
    if (match) {
      return {
        date: match[1].trim(),
        text: match[2].trim()
      };
    }
    
    return {
      date: null,
      text: comment
    };
  }
  
  return { date: null, text: String(comment) };
};

/**
 * Форматирует дату комментария
 */
const formatCommentDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Добавляет комментарий к задаче
 * @param task задача
 * @param commentText текст комментария
 * @returns обновленная задача с новым комментарием
 */
export const addCommentToTask = (task: Task, commentText: string): Task => {
  const now = new Date();
  const formattedDate = now.toISOString();
  
  const newComment = {
    id: `comment-${Date.now()}`,
    text: commentText,
    date: formattedDate
  };
  
  return {
    ...task,
    comments: [...(Array.isArray(task.comments) ? task.comments : []), newComment]
  };
};
