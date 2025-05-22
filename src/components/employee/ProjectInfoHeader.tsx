
import React from "react";
import { Project } from "@/types/project";
import { formatDate } from "@/utils/dateUtils";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface ProjectInfoHeaderProps {
  project: Project;
}

const ProjectInfoHeader: React.FC<ProjectInfoHeaderProps> = ({ project }) => {
  // Рассчитываем общий прогресс проекта
  const calculateProgress = (): number => {
    if (!project.tasks || project.tasks.length === 0) return 0;

    const totalProgress = project.tasks.reduce(
      (sum, task) => sum + (typeof task.progress === 'number' ? task.progress : 0),
      0
    );
    return Math.round(totalProgress / project.tasks.length);
  };

  const progress = calculateProgress();

  // Определяем цвет прогресс-бара в зависимости от значения
  const getProgressColor = (percent: number): string => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Форматируем даты
  const startDate = formatDate(project.startDate);
  const endDate = formatDate(project.endDate);

  return (
    <div className="px-4 py-3 border-b bg-slate-50">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{project.name || "Без названия"}</h3>
        <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
          {project.tasks?.length || 0} задач
        </span>
      </div>
      
      {project.description && (
        <p className="text-sm text-slate-600 mt-1">{project.description}</p>
      )}
      
      <div className="mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-4 mb-1">
          <span className="flex items-center">
            <Icon name="Calendar" className="w-3 h-3 mr-1" />
            Начало: {startDate}
          </span>
          <span className="flex items-center">
            <Icon name="CalendarClock" className="w-3 h-3 mr-1" />
            Окончание: {endDate}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <span>Прогресс проекта:</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-1.5 mt-1"
          indicatorClassName={getProgressColor(progress)}
        />
      </div>
    </div>
  );
};

export default ProjectInfoHeader;
