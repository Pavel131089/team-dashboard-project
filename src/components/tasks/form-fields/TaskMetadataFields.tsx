
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskMetadataFieldsProps {
  price: number | undefined;
  estimatedTime: number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/**
 * Компонент полей метаданных задачи (стоимость и время)
 */
const TaskMetadataFields: React.FC<TaskMetadataFieldsProps> = ({ 
  price = 0, 
  estimatedTime = 0, 
  onChange,
  disabled = false
}) => (
  <>
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="price" className="text-right">
        Стоимость (₽)
      </Label>
      <Input
        id="price"
        name="price"
        type="number"
        value={price || ""}
        onChange={onChange}
        className="col-span-3"
        disabled={disabled}
        placeholder="0"
      />
    </div>
    
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="estimatedTime" className="text-right">
        Время (ч)
      </Label>
      <Input
        id="estimatedTime"
        name="estimatedTime"
        type="number"
        value={estimatedTime || ""}
        onChange={onChange}
        className="col-span-3"
        disabled={disabled}
        placeholder="0"
      />
    </div>
  </>
);

export default TaskMetadataFields;
