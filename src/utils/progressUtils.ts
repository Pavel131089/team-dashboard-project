/**
 * Возвращает класс цвета для прогресс-бара в зависимости от процента выполнения
 * @param percent Процент выполнения задачи
 * @returns CSS класс для цвета прогресс-бара
 */
export const getProgressColorClass = (percent: number): string => {
  // Проверяем, что передано числовое значение
  const validPercent =
    typeof percent === "number" && !isNaN(percent) ? percent : 0;

  if (validPercent >= 75) return "bg-green-500";
  if (validPercent >= 50) return "bg-blue-500";
  if (validPercent >= 25) return "bg-yellow-500";
  return "bg-red-500";
};

/**
 * Обрабатывает изменение прогресса и обновляет дату завершения задачи при необходимости
 * @param task Текущая задача
 * @param newProgress Новое значение прогресса
 * @returns Обновленная задача
 */
export const processProgressChange = (task: any, newProgress: number): any => {
  // Проверка на null/undefined
  if (!task) return null;

  // Убедимся, что передано числовое значение прогресса
  const validProgress =
    typeof newProgress === "number" && !isNaN(newProgress) ? newProgress : 0;

  const updatedTask = { ...task, progress: validProgress };

  // Если прогресс достиг 100%, устанавливаем дату завершения
  if (validProgress === 100 && !updatedTask.actualEndDate) {
    updatedTask.actualEndDate = new Date().toISOString();
  } else if (validProgress < 100) {
    // Если прогресс меньше 100%, убираем дату завершения
    updatedTask.actualEndDate = null;
  }

  // Если прогресс изменился с 0%, и нет даты начала, устанавливаем ее
  const oldProgress =
    typeof task.progress === "number" && !isNaN(task.progress)
      ? task.progress
      : 0;

  if (validProgress > 0 && oldProgress === 0 && !updatedTask.actualStartDate) {
    updatedTask.actualStartDate = new Date().toISOString();
  }

  return updatedTask;
};
