
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  isReadOnly: boolean;
}

/**
 * Компонент заголовка диалога редактирования задачи
 */
const TaskDialogHeader: React.FC<DialogHeaderProps> = ({ isReadOnly }) => {
  // Формируем заголовок в зависимости от режима
  const dialogTitle = isReadOnly ? "Просмотр задачи" : "Редактирование задачи";

  return (
    <DialogHeader>
      <DialogTitle>{dialogTitle}</DialogTitle>
    </DialogHeader>
  );
};

export default TaskDialogHeader;
