
/**
 * Форматирует дату в локализованный формат
 * @param dateString строка с датой в формате ISO
 * @returns отформатированная дата
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return dateString;
  }
}

/**
 * Проверяет, является ли дата текущей
 * @param dateString строка с датой в формате ISO
 * @returns true, если дата сегодняшняя
 */
export function isToday(dateString: string): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Ошибка проверки даты:', error);
    return false;
  }
}

/**
 * Проверяет, просрочена ли дата
 * @param dateString строка с датой в формате ISO
 * @returns true, если дата в прошлом
 */
export function isOverdue(dateString: string): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today;
  } catch (error) {
    console.error('Ошибка проверки просроченной даты:', error);
    return false;
  }
}
