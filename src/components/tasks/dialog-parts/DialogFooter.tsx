
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  isReadOnly: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Компонент футера диалога редактирования задачи
 */
const TaskDialogFooter: React.FC<DialogFooterProps> = ({ 
  isReadOnly, 
  onClose, 
  onSubmit 
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose}>
        {isReadOnly ? "Закрыть" : "Отмена"}
      </Button>
      
      {!isReadOnly && (
        <Button type="button" onClick={onSubmit}>
          Сохранить
        </Button>
      )}
    </DialogFooter>
  );
};

export default TaskDialogFooter;
