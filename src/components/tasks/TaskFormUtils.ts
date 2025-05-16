
import { Task } from "@/types/project";

/**
 * Типы полей формы редактирования задачи
 */
export type TaskFormData = Partial<Task> & {
  assigneeInput?: string;
};

/**
 * Преобразует данные формы в объект задачи
 */
export const prepareTaskDataFromForm = (
  formData: TaskFormData,
  originalTask: Task
): Task => {
  // Формируем базовые данные задачи
  const updatedTask: Task = {
    ...originalTask,
    ...formData,
  };

  // Обрабатываем поле исполнителей, если оно было передано
  if (formData.assigneeInput !== undefined) {
    const assignedToNames = formData.assigneeInput
      ? formData.assigneeInput.split(",").map((name) => name.trim()).filter(Boolean)
      : [];
      
    updatedTask.assignedToNames = assignedToNames;
    
    // Обновляем поле assignedTo в соответствии с форматом
    if (assignedToNames.length > 1) {
      updatedTask.assignedTo = assignedToNames;
    } else if (assignedToNames.length === 1) {
      updatedTask.assignedTo = assignedToNames[0];
    } else {
      updatedTask.assignedTo = null;
    }
  }

  return updatedTask;
};

/**
 * Валидирует данные формы задачи
 * @returns Сообщение об ошибке или null, если данные валидны
 */
export const validateTaskForm = (formData: TaskFormData): string | null => {
  if (!formData.name || formData.name.trim() === "") {
    return "Необходимо указать название задачи";
  }
  
  return null;
};

/**
 * Преобразует значение из события в соответствующий тип
 */
export const processInputValue = (
  name: string, 
  value: string
): string | number => {
  const numericFields = ["price", "estimatedTime", "progress"];
  
  if (numericFields.includes(name)) {
    return value === "" ? 0 : parseFloat(value);
  }
  
  return value;
};
