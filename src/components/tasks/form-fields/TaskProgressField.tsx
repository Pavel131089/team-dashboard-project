
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskProgressFieldProps {
  progress: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент поля прогресса задачи
 */
const TaskProgressField: React.FC<TaskProgressFieldProps> = ({ 
  progress, 
  onChange,
  disabled = false 
}) => (
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
        disabled={disabled}
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
        disabled={disabled}
      />
      <span className="w-9 text-center">{progress}%</span>
    </div>
  </div>
);

export default TaskProgressField;
