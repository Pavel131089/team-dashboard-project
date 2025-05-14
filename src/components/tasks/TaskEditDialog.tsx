
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";

interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
  onSave: (projectId: string, updatedTask: Task) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  isOpen,
  onClose,
  task,
  projectId,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    name: "",
    description: "",
    price: 0,
    estimatedTime: 0,
    startDate: "",
    endDate: "",
    progress: 0,
  });

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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Название
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Описание
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Стоимость (₽)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price || ""}
              onChange={handleInputChange}
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
              value={formData.estimatedTime || ""}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Дата начала
            </Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ""}
              onChange={handleInputChange}
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
              value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ""}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
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
                value={formData.progress}
                onChange={handleInputChange}
              />
              <input
                type="range"
                id="progress-range"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
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

export default TaskEditDialog;
