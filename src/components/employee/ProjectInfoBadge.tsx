import React from "react";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface ProjectInfoBadgeProps {
  project: Project;
  variant?: "default" | "primary" | "secondary" | "outline";
}

const ProjectInfoBadge: React.FC<ProjectInfoBadgeProps> = ({
  project,
  variant = "secondary",
}) => {
  // Рассчитываем общий прогресс проекта
  const calculateProgress = (): number => {
    if (!project.tasks || project.tasks.length === 0) return 0;

    const totalProgress = project.tasks.reduce(
      (sum, task) => sum + (task.progress || 0),
      0,
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant={variant} className="cursor-help">
              <Icon name="FolderOpen" className="mr-1 h-3 w-3" />
              {project.name}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2 p-1 w-64">
            <div className="font-medium">{project.name}</div>
            {project.description && (
              <p className="text-xs text-muted-foreground">
                {project.description}
              </p>
            )}
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Начало:</span>
                <span>{formatDate(project.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Окончание:</span>
                <span>{formatDate(project.endDate)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Прогресс проекта:</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5"
              indicatorClassName={getProgressColor(progress)}
            />
            <div className="text-xs text-muted-foreground">
              Всего задач: {project.tasks.length}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProjectInfoBadge;
