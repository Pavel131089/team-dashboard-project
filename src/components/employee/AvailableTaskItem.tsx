import React from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { formatDate, formatCurrency } from "@/components/utils/FormatUtils";
import ProjectInfoBadge from "@/components/employee/ProjectInfoBadge";

interface AvailableTaskItemProps {
  project: Project;
  task: Task;
  userId: string;
  onAssignTask: (projectId: string, task: Task) => void;
}

const AvailableTaskItem: React.FC<AvailableTaskItemProps> = ({
  project,
  task,
  userId,
  onAssignTask,
}) => {
  const handleAssignTask = () => {
    // Установка текущей даты как actualStartDate
    const updatedTask = {
      ...task,
      assignedTo: task.assignedTo
        ? Array.isArray(task.assignedTo)
          ? [...task.assignedTo, userId]
          : [task.assignedTo, userId]
        : userId,
      actualStartDate: new Date().toISOString(),
    };

    onAssignTask(project.id, updatedTask);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{task.name}</CardTitle>
          <ProjectInfoBadge project={project} />
        </div>
        <CardDescription>{task.description || "Нет описания"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Дата начала:</span>
            <span className="text-sm">{formatDate(task.startDate)}</span>
          </div>
          {task.endDate && (
            <div className="flex items-center gap-1.5">
              <Icon
                name="CalendarRange"
                className="h-4 w-4 text-muted-foreground"
              />
              <span className="text-sm text-muted-foreground">
                Дата окончания:
              </span>
              <span className="text-sm">{formatDate(task.endDate)}</span>
            </div>
          )}
          {task.estimatedTime && (
            <div className="flex items-center gap-1.5">
              <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Расчетное время:
              </span>
              <span className="text-sm">
                {task.estimatedTime}{" "}
                {task.estimatedTime === 1 ? "час" : "часов"}
              </span>
            </div>
          )}
          {task.price && (
            <div className="flex items-center gap-1.5">
              <Icon
                name="DollarSign"
                className="h-4 w-4 text-muted-foreground"
              />
              <span className="text-sm text-muted-foreground">Стоимость:</span>
              <span className="text-sm">{formatCurrency(task.price)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {task.priority && (
            <Badge
              variant={
                task.priority === "HIGH"
                  ? "destructive"
                  : task.priority === "MEDIUM"
                    ? "default"
                    : "outline"
              }
            >
              {task.priority === "HIGH"
                ? "Высокий"
                : task.priority === "MEDIUM"
                  ? "Средний"
                  : "Низкий"}{" "}
              приоритет
            </Badge>
          )}
        </div>
        <Button onClick={handleAssignTask}>
          <Icon name="Plus" className="mr-2 h-4 w-4" />
          Взять в работу
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvailableTaskItem;
