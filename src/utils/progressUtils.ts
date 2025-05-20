
/**
 * Возвращает класс цвета для прогресс-бара в зависимости от значения
 * @param percent Процент выполнения (0-100)
 * @returns Строка с классом цвета для прогресс-бара
 */
export const getProgressColorClass = (percent: number): string => {
  if (percent >= 75) return "bg-green-500";
  if (percent >= 50) return "bg-blue-500";
  if (percent >= 25) return "bg-yellow-500";
  return "bg-red-500";
};

/**
 * Проверяет, достигнут ли 100% прогресс
 * @param progress Текущий прогресс
 * @returns true, если прогресс равен 100%
 */
export const isTaskCompleted = (progress: number): boolean => {
  return progress === 100;
};
