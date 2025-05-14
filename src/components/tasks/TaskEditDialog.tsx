
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";

/**
 * Интерфейс пропсов для диалога редактирования задачи
 */
interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
  onSave: (projectId: string, updatedTask: Task) => void;
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
}) => {
  // Состояние формы
  const [formData, setFormData] = useState<Partial<Task>>({});

  // Загружаем данные задачи при открытии диалога
  useEffect(() => {
    if (task) {
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
   * Обработчик изменения текстовых и числовых полей
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let processedValue: string | number = value;
    if (type === "number") {
      processedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  /**
   * Обработчик сохранения данных задачи
   */
  const handleSubmit = () => {
    if (!task || !formData.name) {
      toast({
        title: "Ошибка",
        description: "Необходимо указать название задачи",
        variant: "destructive",
      });
      return;
    }

    const updatedTask: Task = {
      ...task,
      ...formData,
    };

    onSave(projectId, updatedTask);
    onClose();
    
    toast({
      title: "Задача обновлена",
      description: `Задача "${updatedTask.name}" успешно обновлена`,
    });
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактирование задачи</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <TaskNameField 
            value={formData.name || ""} 
            onChange={handleInputChange} 
          />
          
          <TaskDescriptionField 
            value={formData.description || ""} 
            onChange={handleInputChange} 
          />
          
          <TaskMetadataFields 
            price={formData.price} 
            estimatedTime={formData.estimatedTime}
            onChange={handleInputChange}
          />
          
          <TaskDateFields 
            startDate={formData.startDate}
            endDate={formData.endDate}
            onChange={handleInputChange}
          />
          
          <TaskProgressField 
            progress={formData.progress || 0}
            onChange={handleInputChange}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Компонент поля имени задачи
 */
interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TaskNameField: React.FC<InputFieldProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="name" className="text-right">
      Название
    </Label>
    <Input
      id="name"
      name="name"
      value={value}
      onChange={onChange}
      className="col-span-3"
    />
  </div>
);

/**
 * Компонент поля описания задачи
 */
const TaskDescriptionField: React.FC<InputFieldProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="description" className="text-right">
      Описание
    </Label>
    <Textarea
      id="description"
      name="description"
      value={value}
      onChange={onChange}
      className="col-span-3"
      rows={3}
    />
  </div>
);

/**
 * Компонент полей метаданных задачи (стоимость и время)
 */
interface TaskMetadataFieldsProps {
  price?: number;
  estimatedTime?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskMetadataFields: React.FC<TaskMetadataFieldsProps> = ({ 
  price = 0, 
  estimatedTime = 0, 
  onChange 
}) => (
  <>
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="price" className="text-right">
        Стоимость (₽)
      </Label>
      <Input
        id="price"
        name="price"
        type="number"
        value={price || ""}
        onChange={onChange}
        className="col-span-3"
      />
    </div>
    
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="estimatedTime" className="text-right">
        Время (ч)
      </Label>
      <Input
        id="estimatedTime"
        name="estimatedTime"
        type="number"
        value={estimatedTime || ""}
        onChange={onChange}
        className="col-span-3"
      />
    </div>
  </>
);

/**
 * Компонент полей дат задачи
 */
interface TaskDateFieldsProps {
  startDate?: string | null;
  endDate?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskDateFields: React.FC<TaskDateFieldsProps> = ({ 
  startDate, 
  endDate, 
  onChange 
}) => {
  /**
   * Форматирует дату из ISO в формат для input[type="date"]
   */
  const formatDateForInput = (dateStr?: string | null): string => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="startDate" className="text-right">
          Дата начала
        </Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formatDateForInput(startDate)}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="endDate" className="text-right">
          Дата окончания
        </Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={formatDateForInput(endDate)}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
    </>
  );
};

/**
 * Компонент поля прогресса задачи
 */
interface TaskProgressFieldProps {
  progress: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskProgressField: React.FC<TaskProgressFieldProps> = ({ progress, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="progress" className="text-right">
      Прогресс (%)
    </Label>
    <div className="col-span-3 flex items-center gap-2">
      <Input
        id="progress"
        name="progress"
        type="number"
        min="0"
        max="100"
        value={progress}
        onChange={onChange}
        className="w-20"
      />
      <input
        type="range"
        id="progress-range"
        name="progress"
        min="0"
        max="100"
        value={progress}
        onChange={onChange}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="w-9 text-center">{progress}%</span>
    </div>
  </div>
);

export default TaskEditDialog;
