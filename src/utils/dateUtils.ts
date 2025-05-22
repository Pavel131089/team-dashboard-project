/**
 * Форматирует дату в локализованный формат
 * @param dateString строка с датой в формате ISO
 * @returns отформатированная дата
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Неверная дата";
    }

    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Ошибка формата";
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
    console.error("Ошибка проверки даты:", error);
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
    console.error("Ошибка проверки просроченной даты:", error);
    return false;
  }
}

/**
 * Возвращает оставшееся время до даты в виде строки
 * @param dateString строка с датой в формате ISO
 * @returns строка с информацией о том, сколько времени осталось
 */
export function getTimeRemaining(
  dateString: string | undefined | null,
): string {
  if (!dateString) return "Дата не указана";

  try {
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      return "Неверная дата";
    }

    const now = new Date();

    // Если дата в прошлом
    if (targetDate < now) {
      return "Просрочено";
    }

    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Сегодня";
    } else if (diffDays === 1) {
      return "Завтра";
    } else if (diffDays <= 7) {
      return `${diffDays} дн.`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} нед.`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} мес.`;
    }
  } catch (error) {
    console.error("Ошибка расчета оставшегося времени:", error);
    return "Ошибка расчета";
  }
}
