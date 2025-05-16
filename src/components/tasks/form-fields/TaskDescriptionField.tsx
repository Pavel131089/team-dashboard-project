
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент поля описания задачи
 */
const TaskDescriptionField: React.FC<TaskDescriptionFieldProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => (
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
      disabled={disabled}
      placeholder="Введите описание задачи"
    />
  </div>
);

export default TaskDescriptionField;
