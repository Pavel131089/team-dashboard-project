import React from "react";
import { Project } from "@/types/project";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/utils/dateUtils";

interface ProjectInfoHeaderProps {
  project?: Project;
  projectName: string;
}

const ProjectInfoHeader: React.FC<ProjectInfoHeaderProps> = ({ 
  project, 
  projectName 
}) => {
  // Рассчитываем прогресс проекта
  const calculateProgress = (): number => {
    if (!project?.tasks || project.tasks.length === 0) return 0;

    const totalProgress = project.tasks.reduce(
      (sum, task) => sum + (typeof task.progress === 'number' ? task.progress : 0),
      0
    );
    return Math.round(totalProgress / project.tasks.length);
  };

  const progress = calculateProgress();

  // Определяем цвет прогресс-бара
  const getProgressColor = (value: number): string => {
    if (value >= 75) return "bg-green-500";
    if (value >= 50) return "bg-blue-500";
    if (value >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="border-b bg-gray-50 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg flex items-center">
            <Icon name="Folder" className="h-4 w-4 mr-2 text-primary" />
            {projectName}
          </h3>
          {project?.description && (
            <p className="text-sm text-slate-600 mt-1">{project.description}</p>
          )}
        </div>
      </div>
      
      {project && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-xs text-slate-500">
              <Icon name="Calendar" className="h-3 w-3 mr-1" />
              <span>Дата начала: {formatDate(project.startDate) || "Не указана"}</span>
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <Icon name="CalendarClock" className="h-3 w-3 mr-1" />
              <span>Дата окончания: {formatDate(project.endDate) || "Не указана"}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Прогресс проекта:</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              indicatorClassName={getProgressColor(progress)}
            />
            <div className="text-xs text-slate-500">
              Всего задач: {project.tasks.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInfoHeader;
