
import { format } from "date-fns";
import { ru } from "date-fns/locale";

/**
 * Форматирует дату в человекочитаемый формат
 * @param dateStr Строка даты в ISO формате или null/undefined
 * @returns Форматированная дата или дефолтное значение при отсутствии
 */
export const formatDate = (dateStr: string | null | undefined, defaultValue: string = "—"): string => {
  if (!dateStr) return defaultValue;
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: ru });
  } catch (e) {
    console.warn("Error formatting date:", e);
    return dateStr;
  }
};

/**
 * Форматирует дату и время для отображения в комментариях
 * @param dateString Строка даты в ISO формате
 * @returns Форматированная дата и время
 */
export const formatCommentDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "dd.MM.yyyy, HH:mm", { 
      locale: ru 
    });
  } catch (e) {
    console.warn("Error formatting comment date:", e);
    return dateString;
  }
};
