
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskDateFieldsProps {
  startDate?: string | null;
  endDate?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент полей дат задачи
 */
const TaskDateFields: React.FC<TaskDateFieldsProps> = ({ 
  startDate, 
  endDate, 
  onChange,
  disabled = false 
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
          disabled={disabled}
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
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default TaskDateFields;
