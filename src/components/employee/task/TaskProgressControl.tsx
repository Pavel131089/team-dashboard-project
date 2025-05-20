
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { getProgressColorClass } from "@/utils/progressUtils";

interface TaskProgressControlProps {
  progress: number;
  onProgressChange: (newProgress: number) => void;
}

const TaskProgressControl: React.FC<TaskProgressControlProps> = ({
  progress,
  onProgressChange,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs">{progress}%</span>
      </div>
      <div className="flex">
        <Slider
          value={[progress || 0]}
          min={0}
          max={100}
          step={5}
          className="mb-2"
          onValueChange={(values) => onProgressChange(values[0])}
        />
      </div>
      <Progress
        value={progress || 0}
        className="h-2"
        indicatorClassName={getProgressColorClass(progress || 0)}
      />
    </div>
  );
};

export default TaskProgressControl;
