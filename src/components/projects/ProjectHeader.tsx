import React from "react";
import { Project } from "@/types/project";
import { AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import ProjectProgress from "@/components/projects/ProjectProgress";
import { formatDate, formatCurrency } from "@/components/utils/FormatUtils";

// Функция для расчета количества дней между датами
const calculateDaysBetween = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): number => {
  if (!startDate) return 0;

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  // Разница в миллисекундах
  const diffTime = Math.abs(end.getTime() - start.getTime());
  // Конвертация в дни
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Функция для расчета общей стоимости задач
const calculateTotalTasksPrice = (project: Project): number => {
  return project.tasks.reduce((total, task) => total + (task.price || 0), 0);
};

// Функция для расчета количества дней, прошедших с начала проекта
const calculateDaysElapsed = (startDate: string | null | undefined): number => {
  if (!startDate) return 0;

  const start = new Date(startDate);
  const today = new Date();

  // Если проект еще не начался, возвращаем 0
  if (start > today) return 0;

  // Разница в миллисекундах
  const diffTime = Math.abs(today.getTime() - start.getTime());
  // Конвертация в дни
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  // Рассчитываем общую стоимость задач
  const totalTasksPrice = calculateTotalTasksPrice(project);

  // Рассчитываем количество дней, прошедших с начала проекта
  const daysElapsed = calculateDaysElapsed(project.startDate);

  // Количество задач в проекте
  const tasksCount = project.tasks.length;

  return (
    <>
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Icon name="FolderOpen" className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-base font-medium">{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                {project.description || "Нет описания"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-auto">
              Задач: {tasksCount}
            </Badge>
            <Badge variant="secondary" className="font-mono">
              {formatCurrency(totalTasksPrice)}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3 pt-0">
        <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="flex items-center gap-1.5">
            <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Даты:</span>
            <span className="text-sm font-medium">
              {formatDate(project.startDate)} — {formatDate(project.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Прошло дней:</span>
            <span className="text-sm font-medium">
              {daysElapsed}{" "}
              {daysElapsed === 1
                ? "день"
                : daysElapsed > 1 && daysElapsed < 5
                  ? "дня"
                  : "дней"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Бюджет:</span>
            <span className="text-sm font-medium">
              {formatCurrency(project.price || 0)} /{" "}
              {formatCurrency(totalTasksPrice)} (задачи)
            </span>
          </div>
        </div>

        <ProjectProgress project={project} />
      </AccordionContent>
    </>
  );
};

export default ProjectHeader;
