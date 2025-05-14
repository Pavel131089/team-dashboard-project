import { Progress } from "@/components/ui/progress";

interface TaskProgressProps {
  progress: number;
  projectId?: string;
  onProgressChange?: (projectId: string, progress: number) => void;
  task: any;
}

/**
 * Возвращает цвет индикатора прогресса в зависимости от значения
 */
const getProgressColor = (progress: number) => {
  if (progress < 30) return "bg-red-500";
  if (progress < 70) return "bg-yellow-500";
  return "bg-green-500";
};

/**
 * Компонент для отображения и редактирования прогресса задачи
 */
const TaskProgress = ({
  progress,
  projectId,
  onProgressChange,
  task,
}: TaskProgressProps) => {
  const handleProgressChange = (value: string) => {
    if (onProgressChange && projectId) {
      onProgressChange(projectId, parseInt(value));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {/* Обертка для прогресс бара с кастомным цветным оверлеем */}
        <div className="relative h-2 w-24">
          {/* Базовый прогресс бар без indicatorClassName */}
          <Progress value={progress || 0} className="h-2 w-24" />
          {/* Цветной оверлей для индикатора */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                (progress || 0) < 30
                  ? "bg-red-500"
                  : (progress || 0) < 70
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        </div>
        <span className="text-xs">{progress || 0}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={progress || 0}
        onChange={(e) => handleProgressChange(e.target.value)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default TaskProgress;
