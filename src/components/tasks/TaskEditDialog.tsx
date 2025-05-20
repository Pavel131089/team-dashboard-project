import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Task } from "@/types/project";

// Импортируем новые компоненты
import TaskDialogHeader from "./dialog-parts/DialogHeader";
import TaskDialogFooter from "./dialog-parts/DialogFooter";
import DialogFormContent from "./dialog-parts/DialogFormContent";
import { useTaskForm } from "@/hooks/useTaskForm";

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
  // Используем хук для управления формой
  const { formData, assigneeInput, handleInputChange, handleSubmit } =
    useTaskForm(task, projectId, onSave, onClose);

  // Если задача не передана, не отображаем диалог
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Заголовок диалога */}
        <TaskDialogHeader isReadOnly={isReadOnly} />

        {/* Содержимое формы */}
        <DialogFormContent
          formData={formData}
          assigneeInput={assigneeInput}
          isReadOnly={isReadOnly}
          onInputChange={handleInputChange}
        />

        {/* Футер диалога */}
        <TaskDialogFooter
          isReadOnly={isReadOnly}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
