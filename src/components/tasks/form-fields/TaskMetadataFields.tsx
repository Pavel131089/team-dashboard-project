
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskMetadataFieldsProps {
  price?: number | null;
  estimatedTime?: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент полей метаданных задачи (цена, время)
 */
const TaskMetadataFields: React.FC<TaskMetadataFieldsProps> = ({ 
  price, 
  estimatedTime, 
  onChange,
  disabled = false 
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Цена (₽)
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={price === 0 ? "" : price || ""}
          onChange={onChange}
          className="col-span-3"
          disabled={disabled}
          placeholder="0"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="estimatedTime" className="text-right">
          Оценка времени (ч)
        </Label>
        <Input
          id="estimatedTime"
          name="estimatedTime"
          type="number"
          value={estimatedTime === 0 ? "" : estimatedTime || ""}
          onChange={onChange}
          className="col-span-3"
          disabled={disabled}
          placeholder="0"
        />
      </div>
    </>
  );
};

export default TaskMetadataFields;
