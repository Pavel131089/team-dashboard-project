
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskAssigneesFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент поля для указания исполнителей задачи
 */
const TaskAssigneesField: React.FC<TaskAssigneesFieldProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="assignedToNames" className="text-right">
      Исполнители
    </Label>
    <Input
      id="assignedToNames"
      name="assignedToNames"
      value={value}
      onChange={onChange}
      className="col-span-3"
      disabled={disabled}
      placeholder="Введите имена исполнителей через запятую"
    />
  </div>
);

export default TaskAssigneesField;
