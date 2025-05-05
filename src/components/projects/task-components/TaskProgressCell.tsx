
import React from "react";
import { Progress } from "@/components/ui/progress";

interface TaskProgressCellProps {
  progress: number;
  onProgressChange: (progress: number) => void;
}

const TaskProgressCell: React.FC<TaskProgressCellProps> = ({ 
  progress, 
  onProgressChange 
}) => {
  const getProgressColorClass = (value: number): string => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Progress
          value={progress}
          className="h-2 w-24"
          indicatorClassName={getProgressColorClass(progress)}
        />
        <span className="text-xs">{progress}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={progress}
        onChange={(e) => onProgressChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default TaskProgressCell;
