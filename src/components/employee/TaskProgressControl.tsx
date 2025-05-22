import React, { useState, useEffect } from "react";
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
  // Локальное состояние для отслеживания значения слайдера
  const [sliderValue, setSliderValue] = useState<number>(progress || 0);

  // Обновляем локальное состояние при изменении пропса progress
  useEffect(() => {
    setSliderValue(progress || 0);
  }, [progress]);

  // Обработчик изменения значения слайдера
  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
  };

  // Обработчик отпускания слайдера - только здесь вызываем родительский onProgressChange
  const handleSliderCommit = () => {
    if (sliderValue !== progress) {
      onProgressChange(sliderValue);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs">{sliderValue}%</span>
      </div>
      <div className="flex">
        <Slider
          value={[sliderValue]}
          min={0}
          max={100}
          step={5}
          className="mb-2"
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />
      </div>
      <Progress
        value={sliderValue}
        className="h-2"
        indicatorClassName={getProgressColorClass(sliderValue)}
      />
    </div>
  );
};

export default TaskProgressControl;
