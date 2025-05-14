
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
  // Это решение полностью обходит использование indicatorClassName
  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {/* Обертка для прогресс бара с кастомным цветным оверлеем */}
        <div className="relative h-2 w-24">
          {/* Базовый прогресс бар без indicatorClassName */}
          <Progress
            value={progress}
            className="h-2 w-24"
          />
          {/* Цветной оверлей для индикатора */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                progress < 30 ? 'bg-red-500' : 
                progress < 70 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
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
