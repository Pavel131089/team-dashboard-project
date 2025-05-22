import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Task, Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import EmptyAvailableTasks from "@/components/employee/EmptyAvailableTasks";

interface AvailableTasksSectionProps {
  tasks: Array<{ project: any; task: Task }>;
  onTakeTask: (taskId: string, projectId: string) => void;
  projects?: Project[];
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({
  tasks,
  onTakeTask,
  projects = [],
}) => {
  // Проверяем, есть ли доступные задачи
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <EmptyAvailableTasks />;
  }

  // Безопасное форматирование даты
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Не указано";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Не указано";
      return date.toLocaleDateString("ru-RU");
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return "Не указано";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon name="Briefcase" className="text-primary h-5 w-5" />
          <CardTitle>Доступные задачи</CardTitle>
        </div>
        <CardDescription>
          Задачи, которые вы можете взять в работу
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(({ task, project }) => {
          // Получаем даты задачи или проекта
          const startDate = task.startDate || project?.startDate;
          const endDate = task.endDate || project?.endDate;

          // Отладка
          console.log(`Rendering available task ${task.id}:`, {
            taskName: task.name,
            taskStartDate: task.startDate,
            taskEndDate: task.endDate,
            projectStartDate: project?.startDate,
            projectEndDate: project?.endDate,
            finalStartDate: startDate,
            finalEndDate: endDate,
          });

          return (
            <div key={task.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base">{task.name}</h3>
                  {task.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {project?.name || "Проект"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" className="h-3 w-3" />
                  <span>Начало: {formatDate(startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="CalendarClock" className="h-3 w-3" />
                  <span>Окончание: {formatDate(endDate)}</span>
                </div>
                {task.estimatedTime ? (
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" className="h-3 w-3" />
                    <span>Время: {task.estimatedTime} ч.</span>
                  </div>
                ) : null}
                {task.price ? (
                  <div className="flex items-center gap-1">
                    <Icon name="CircleDollarSign" className="h-3 w-3" />
                    <span>Цена: {task.price} ₽</span>
                  </div>
                ) : null}
              </div>

              <Button
                onClick={() => onTakeTask(task.id, project?.id || "")}
                className="w-full mt-3"
                size="sm"
              >
                <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                Взять в работу
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AvailableTasksSection;
