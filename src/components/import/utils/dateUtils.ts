
/**
 * Утилиты для работы с датами
 */

/**
 * Парсит дату из строки в ISO формат
 * @param dateStr - Строка с датой
 * @returns ISO строка даты или null, если парсинг не удался
 */
export const parseDate = (dateStr: string): string | null => {
  if (!dateStr || dateStr === '—') return null;
  
  // Пытаемся распарсить как дату
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  
  // Преобразуем формат DD.MM.YYYY в YYYY-MM-DD
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const newDate = new Date(formattedDate);
    if (!isNaN(newDate.getTime())) {
      return newDate.toISOString();
    }
  }
  
  return null;
};

/**
 * Форматирует дату для отображения
 * @param date - Дата в ISO формате
 * @returns Отформатированная дата
 */
export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString();
  } catch (e) {
    return date;
  }
};
