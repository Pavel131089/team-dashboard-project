
/**
 * Возвращает класс цвета для прогресс-бара в зависимости от процента выполнения
 * @param percent Процент выполнения задачи
 * @returns CSS класс для цвета прогресс-бара
 */
export const getProgressColorClass = (percent: number): string => {
  if (percent >= 75) return "bg-green-500";
  if (percent >= 50) return "bg-blue-500";
  if (percent >= 25) return "bg-yellow-500";
  return "bg-red-500";
};

/**
 * Обрабатывает изменение прогресса и обновляет дату завершения задачи при необходимости
 * @param task Текущая задача
 * @param newProgress Новое значение прогресса
 * @returns Обновленная задача
 */
export const processProgressChange = (task: any, newProgress: number): any => {
  const updatedTask = { ...task, progress: newProgress };
  
  // Если прогресс достиг 100%, устанавливаем дату завершения
  if (newProgress === 100 && !updatedTask.actualEndDate) {
    updatedTask.actualEndDate = new Date().toISOString();
  }
  
  // Если прогресс изменился с 0%, и нет даты начала, устанавливаем ее
  if (newProgress > 0 && task.progress === 0 && !updatedTask.actualStartDate) {
    updatedTask.actualStartDate = new Date().toISOString();
  }
  
  return updatedTask;
};
