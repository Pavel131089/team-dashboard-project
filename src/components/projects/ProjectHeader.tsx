import React from "react";
import { Project } from "@/types/project";
import { AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import ProjectProgress from "./ProjectProgress";

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  // Форматирование суммы с разделителями тысяч
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Расчет общей стоимости всех задач
  const calculateTotalBudget = () => {
    return project.tasks.reduce((sum, task) => sum + (task.price || 0), 0);
  };

  // Расчет общего времени всех задач
  const calculateTotalTime = () => {
    return project.tasks.reduce(
      (sum, task) => sum + (task.estimatedTime || 0),
      0,
    );
  };

  const totalBudget = calculateTotalBudget();
  const totalTime = calculateTotalTime();

  return (
    <div className="p-4 pb-0">
      <AccordionTrigger className="py-2 hover:no-underline">
        <div className="flex flex-1 flex-col items-start text-left">
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-medium">{project.name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="rounded-md">
                <Icon name="Calendar" className="mr-1 h-3.5 w-3.5" />
                {project.startDate || "Не указано"}
              </Badge>
              <Badge variant="outline" className="rounded-md">
                <Icon name="Clock" className="mr-1 h-3.5 w-3.5" />
                {totalTime} ч
              </Badge>
              <Badge variant="outline" className="rounded-md">
                <Icon name="DollarSign" className="mr-1 h-3.5 w-3.5" />
                {formatCurrency(totalBudget)}
              </Badge>
              <Badge variant="outline" className="rounded-md">
                <Icon name="ListTodo" className="mr-1 h-3.5 w-3.5" />
                {project.tasks.length} задач
                {project.tasks.length === 1
                  ? "а"
                  : project.tasks.length > 1 && project.tasks.length < 5
                    ? "и"
                    : ""}
              </Badge>
            </div>
          </div>

          {/* Здесь вставляем компонент с информацией о прогрессе */}
          <ProjectProgress project={project} />
        </div>
      </AccordionTrigger>
    </div>
  );
};

export default ProjectHeader;
