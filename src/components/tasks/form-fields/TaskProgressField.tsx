
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

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
}) => {
  // Обработчик изменения слайдера
  const handleSliderChange = (value: number[]) => {
    const event = {
      target: {
        name: "progress",
        value: value[0].toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(event);
  };
  
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="progress" className="text-right">
        Прогресс (%)
      </Label>
      <div className="col-span-3 space-y-2">
        <div className="flex items-center gap-2">
          <Input
            id="progress"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={progress === 0 ? "" : progress}
            onChange={onChange}
            disabled={disabled}
            placeholder="0"
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">
            {progress}%
          </span>
        </div>
        
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={5}
          onValueChange={handleSliderChange}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default TaskProgressField;
