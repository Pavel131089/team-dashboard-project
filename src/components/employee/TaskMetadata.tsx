
import React from "react";

interface TaskMetadataProps {
  price: number;
  estimatedTime: number;
}

const TaskMetadata: React.FC<TaskMetadataProps> = ({ price, estimatedTime }) => {
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
        Цена: {price} ₽
      </span>
      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
        Время: {estimatedTime} ч
      </span>
    </div>
  );
};

export default TaskMetadata;
