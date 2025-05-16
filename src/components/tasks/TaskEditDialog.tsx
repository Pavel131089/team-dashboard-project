
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";

// Импорт компонентов полей формы
import TaskNameField from "./form-fields/TaskNameField";
import TaskDescriptionField from "./form-fields/TaskDescriptionField";
import TaskMetadataFields from "./form-fields/TaskMetadataFields";
import TaskDateFields from "./form-fields/TaskDateFields";
import TaskProgressField from "./form-fields/TaskProgressField";
import TaskAssigneesField from "./form-fields/TaskAssigneesField";

// Импорт утилит для работы с формой
import { TaskFormData, prepareTaskDataFromForm, validateTaskForm, processInputValue } from "./TaskFormUtils";

/**
 * Интерфейс пропсов для диалога редактирования задачи
 */
interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
  onSave: (projectId: string, updatedTask: Task) => void;
  isReadOnly?: boolean;
}

/**
 * Компонент диалога редактирования задачи
 */
const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  isOpen,
  onClose,
  task,
  projectId,
  onSave,
  isReadOnly = false,
}) => {
  // Состояние формы
  const [formData, setFormData] = useState<TaskFormData>({});
  // Отдельное состояние для поля исполнителей (для упрощения ввода)
  const [assigneeInput, setAssigneeInput] = useState("");

  // Загружаем данные задачи при открытии диалога
  useEffect(() => {
    if (task && isOpen) {
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
  }, [task, isOpen]);

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
    
    // Преобразование значения в соответствующий тип
    const processedValue = processInputValue(name, value);
    
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

  // Если задача не передана, не отображаем диалог
  if (!task) return null;

  // Формируем заголовок в зависимости от режима
  const dialogTitle = isReadOnly ? "Просмотр задачи" : "Редактирование задачи";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <TaskNameField 
            value={formData.name || ""} 
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
          
          <TaskDescriptionField 
            value={formData.description || ""} 
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
          
          <TaskAssigneesField
            value={assigneeInput}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
          
          <TaskMetadataFields 
            price={formData.price} 
            estimatedTime={formData.estimatedTime}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
          
          <TaskDateFields 
            startDate={formData.startDate}
            endDate={formData.endDate}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
          
          <TaskProgressField 
            progress={formData.progress || 0}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {isReadOnly ? "Закрыть" : "Отмена"}
          </Button>
          {!isReadOnly && (
            <Button type="button" onClick={handleSubmit}>
              Сохранить
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
