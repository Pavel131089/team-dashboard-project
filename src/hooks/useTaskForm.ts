
import { useState, useEffect } from "react";
import { Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import { TaskFormData, prepareTaskDataFromForm, validateTaskForm } from "@/components/tasks/TaskFormUtils";

/**
 * Хук для управления формой редактирования задачи
 */
export function useTaskForm(
  task: Task | null,
  projectId: string,
  onSave: (projectId: string, updatedTask: Task) => void,
  onClose: () => void
) {
  // Состояние формы
  const [formData, setFormData] = useState<TaskFormData>({});
  // Отдельное состояние для поля исполнителей (для упрощения ввода)
  const [assigneeInput, setAssigneeInput] = useState("");

  // Загружаем данные задачи при изменении переданной задачи
  useEffect(() => {
    if (task) {
      // Преобразуем массив исполнителей в строку
      const assigneesString = Array.isArray(task.assignedToNames) 
        ? task.assignedToNames.join(", ") 
        : typeof task.assignedToNames === 'string' 
          ? task.assignedToNames 
          : "";
      
      setAssigneeInput(assigneesString);
      
      // Инициализируем форму данными из задачи
      setFormData({
        name: task.name || "",
        description: task.description || "",
        price: task.price || 0,
        estimatedTime: task.estimatedTime || 0,
        startDate: task.startDate || "",
        endDate: task.endDate || "",
        progress: task.progress || 0,
        assignedTo: task.assignedTo,
        assignedToNames: task.assignedToNames,
        actualStartDate: task.actualStartDate,
        actualEndDate: task.actualEndDate,
        comments: task.comments,
      });
    }
  }, [task]);

  /**
   * Обработчик изменения полей формы
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Особая обработка для поля исполнителей
    if (name === "assignedToNames") {
      setAssigneeInput(value);
      return;
    }
    
    // Обработка разных типов полей
    let processedValue: string | number = value;
    if (name === "price" || name === "estimatedTime" || name === "progress") {
      processedValue = value === "" ? 0 : parseFloat(value);
    }
    
    // Обновление состояния формы
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  /**
   * Обработчик сохранения данных задачи
   */
  const handleSubmit = () => {
    if (!task) {
      toast({
        title: "Ошибка",
        description: "Задача не найдена",
        variant: "destructive",
      });
      return;
    }

    // Проверяем валидность данных формы
    const formDataWithAssignees: TaskFormData = {
      ...formData,
      assigneeInput,
    };
    
    const validationError = validateTaskForm(formDataWithAssignees);
    if (validationError) {
      toast({
        title: "Ошибка валидации",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Подготавливаем данные для сохранения
    const updatedTask = prepareTaskDataFromForm(formDataWithAssignees, task);

    // Сохраняем задачу
    onSave(projectId, updatedTask);
    onClose();
    
    toast({
      title: "Задача обновлена",
      description: `Задача "${updatedTask.name}" успешно обновлена`,
    });
  };

  return {
    formData,
    assigneeInput,
    handleInputChange,
    handleSubmit
  };
}
