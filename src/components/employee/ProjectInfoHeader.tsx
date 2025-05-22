import React from "react";
import { Project } from "@/types/project";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { getProgressColorClass } from "@/utils/progressUtils";

interface ProjectInfoHeaderProps {
  project?: Project;
  projectName: string;
}

const ProjectInfoHeader: React.FC<ProjectInfoHeaderProps> = ({
  project,
  projectName,
}) => {
  // Вычисляем прогресс проекта
  const calculateProgress = (): number => {
    if (!project?.tasks || project.tasks.length === 0) return 0;

    const totalProgress = project.tasks.reduce(
      (sum, task) => sum + (task.progress || 0),
      0,
    );
    return Math.round(totalProgress / project.tasks.length);
  };

  const progress = calculateProgress();

  // Форматирование даты
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Не указано";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch (error) {
      return "Неверный формат";
    }
  };

  return (
    <div className="bg-slate-50 p-3 border-b">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg flex items-center">
            <Icon name="Briefcase" className="h-5 w-5 mr-2 text-primary" />
            {projectName}
          </h3>
          <span className="text-sm font-medium">{progress}% выполнено</span>
        </div>

        {project?.description && (
          <p className="text-sm text-slate-600 mt-1 mb-2">
            {project.description}
          </p>
        )}

        {project && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 mb-2">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" className="h-3 w-3" />
              <span>Начало: {formatDate(project.startDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="CalendarCheck" className="h-3 w-3" />
              <span>Окончание: {formatDate(project.endDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="ListChecks" className="h-3 w-3" />
              <span>Задач: {project.tasks.length}</span>
            </div>
          </div>
        )}

        <Progress
          value={progress}
          className="h-2 mt-1"
          indicatorClassName={getProgressColorClass(progress)}
        />
      </div>
    </div>
  );
};

export default ProjectInfoHeader;
