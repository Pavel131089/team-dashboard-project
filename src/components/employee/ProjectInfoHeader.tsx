
import React from "react";
import { Project } from "@/types/project";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/utils/dateUtils";

interface ProjectInfoHeaderProps {
  project?: Project;
  projectName: string;
}

/**
 * Компонент для отображения информации о проекте
 */
const ProjectInfoHeader: React.FC<ProjectInfoHeaderProps> = ({
  project,
  projectName,
}) => {
  // Функция для расчета прогресса проекта
  const calculateProgress = (): number => {
    if (!project?.tasks || !Array.isArray(project.tasks) || project.tasks.length === 0) return 0;

    const totalProgress = project.tasks.reduce(
      (sum, task) => sum + (typeof task.progress === "number" ? task.progress : 0),
      0
    );
    return Math.round(totalProgress / project.tasks.length);
  };

  // Получаем прогресс проекта
  const progress = calculateProgress();

  // Определяем цвет прогресс-бара в зависимости от значения
  const getProgressColor = (percent: number): string => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Функция для определения оставшегося времени
  const getRemainingTime = (): string => {
    if (!project?.endDate) return "Срок не установлен";

    try {
      const endDate = new Date(project.endDate);
      const today = new Date();
      
      // Если дата окончания в прошлом
      if (endDate < today) {
        return "Срок прошел";
      }
      
      // Вычисляем разницу в днях
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return `Осталось: ${diffDays} дн.`;
    } catch (error) {
      return "Невозможно определить";
    }
  };

  return (
    <div className="bg-slate-50 p-4 border-b">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            <Icon name="Folder" className="h-5 w-5 mr-2 text-blue-500" />
            {projectName}
          </h3>
          {project?.description && (
            <p className="text-sm text-slate-600 mt-1 max-w-lg">
              {project.description}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-sm text-slate-500">
            {getRemainingTime()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-3">
        <div className="flex items-center gap-1">
          <Icon name="Calendar" className="h-4 w-4 text-slate-500" />
          <span className="text-slate-700">
            Начало: {project?.startDate ? formatDate(project.startDate) : "Не указано"}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Icon name="CalendarClock" className="h-4 w-4 text-slate-500" />
          <span className="text-slate-700">
            Окончание: {project?.endDate ? formatDate(project.endDate) : "Не указано"}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Icon name="ListChecks" className="h-4 w-4 text-slate-500" />
          <span className="text-slate-700">
            Задач: {project?.tasks ? project.tasks.length : 0}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Прогресс проекта</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2"
          indicatorClassName={getProgressColor(progress)}
        />
      </div>
    </div>
  );
};

export default ProjectInfoHeader;
