
import React from "react";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface TaskMetadataProps {
  price: number;
  estimatedTime: number;
}

const TaskMetadata: React.FC<TaskMetadataProps> = ({ price, estimatedTime }) => {
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      {price > 0 && (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
          <Icon name="CircleDollarSign" className="h-3 w-3 mr-1" />
          Цена: {price} ₽
        </span>
      )}
      {estimatedTime > 0 && (
        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center">
          <Icon name="Clock" className="h-3 w-3 mr-1" />
          Время: {estimatedTime} ч
        </span>
      )}
    </div>
  );
};

export default TaskMetadata;
