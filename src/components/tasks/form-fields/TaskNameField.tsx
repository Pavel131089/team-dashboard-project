
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент поля имени задачи
 */
const TaskNameField: React.FC<TaskNameFieldProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => (
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
      disabled={disabled}
      placeholder="Введите название задачи"
    />
  </div>
);

export default TaskNameField;
