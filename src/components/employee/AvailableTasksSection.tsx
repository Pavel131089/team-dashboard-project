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
  tasks: any[];
  onTakeTask: (taskId: string, projectId: string) => void;
  projects?: Project[];
}

// Безопасное форматирование даты
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "Не указано";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Не указано";
    return date.toLocaleDateString("ru-RU");
  } catch (error) {
    return "Не указано";
  }
};

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({
  tasks,
  onTakeTask,
  projects = [],
}) => {
  // Простая проверка на отсутствие задач
  if (!tasks || tasks.length === 0) {
    return <EmptyAvailableTasks />;
  }

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
        {tasks.map((item, index) => {
          // Определяем структуру элемента
          let task, project;

          if (item && typeof item === "object") {
            // Если это объект типа {task, project}
            if (item.task) {
              task = item.task;
              project = item.project;
            } else {
              // Если это просто объект task
              task = item;
              if (task.projectId && projects.length > 0) {
                project = projects.find((p) => p.id === task.projectId) || {};
              } else {
                project = {};
              }
            }
          } else {
            // Если данные некорректные, пропускаем
            return null;
          }

          // Генерируем id, если он отсутствует
          const taskId = task.id || `task-${index}`;
          const projectId = project?.id || "";

          // Получаем даты задачи или проекта
          const startDate = task.startDate || (project && project.startDate);
          const endDate = task.endDate || (project && project.endDate);

          return (
            <div key={taskId} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base">
                    {task.name || "Без названия"}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {project && project.name ? project.name : "Проект"}
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
                onClick={() => onTakeTask(taskId, projectId)}
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
