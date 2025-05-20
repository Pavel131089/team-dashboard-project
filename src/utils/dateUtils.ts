
import { format } from "date-fns";
import { ru } from "date-fns/locale";

/**
 * Форматирует дату в человекочитаемый формат
 * @param dateStr Строка даты, null или undefined
 * @returns Отформатированная дата или "—" если дата отсутствует
 */
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: ru });
  } catch (e) {
    return dateStr;
  }
};

/**
 * Форматирует дату и время для комментариев
 * @param dateStr Строка даты
 * @returns Отформатированная дата и время
 */
export const formatCommentDate = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), "dd.MM.yyyy, HH:mm", { locale: ru });
  } catch (e) {
    return dateStr;
  }
};

/**
 * Парсит комментарий на дату и текст
 * @param comment Комментарий в формате "дата: текст"
 * @returns Объект с датой и текстом комментария
 */
export const parseComment = (comment: string): { date: string; text: string } => {
  const match = comment.match(/^([^:]+):\s*(.*)/);
  if (match && match.length >= 3) {
    try {
      const dateStr = match[1].trim();
      const text = match[2].trim();
      return {
        date: formatCommentDate(dateStr),
        text: text
      };
    } catch (e) {
      return { date: "", text: comment };
    }
  }
  return { date: "", text: comment };
};
