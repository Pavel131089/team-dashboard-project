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
import { Progress } from "@/components/ui/progress";
import { getProgressColorClass } from "@/utils/progressUtils";
import EmptyAvailableTasks from "@/components/employee/EmptyAvailableTasks";

interface AvailableTasksSectionProps {
  tasks: any[];
  onTakeTask: (taskId: string, projectId: string) => void;
  projects?: Project[];
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({
  tasks,
  onTakeTask,
  projects = [],
}) => {
  // Проверяем, что у нас есть задачи для отображения
  const hasAvailableTasks = Array.isArray(tasks) && tasks.length > 0;

  // Простая функция форматирования даты
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Не указано";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch (error) {
      return "Не указано";
    }
  };

  // Функция для расчета прогресса проекта
  const calculateProjectProgress = (project: any): number => {
    if (
      !project ||
      !project.tasks ||
      !Array.isArray(project.tasks) ||
      project.tasks.length === 0
    ) {
      return 0;
    }

    const totalProgress = project.tasks.reduce(
      (sum, task) => sum + (task.progress || 0),
      0,
    );
    return Math.round(totalProgress / project.tasks.length);
  };

  // Функция для отображения сотрудников, назначенных на задачу
  const renderAssignedUsers = (task: any): JSX.Element | null => {
    if (
      !task.assignedToNames ||
      !Array.isArray(task.assignedToNames) ||
      task.assignedToNames.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Icon name="Users" className="h-3 w-3" />
          <span>Исполнители: {task.assignedToNames.join(", ")}</span>
        </div>
      </div>
    );
  };

  // Функция для поиска полной информации о проекте
  const getFullProject = (projectId: string): Project | undefined => {
    if (!Array.isArray(projects)) return undefined;
    return projects.find((p) => p.id === projectId);
  };

  // Если нет задач, показываем пустое состояние
  if (!hasAvailableTasks) {
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
          // Извлекаем task и project из структуры
          const task = item.task || item;
          const itemProject = item.project || {};

          // Ищем полную информацию о проекте
          const projectId = task.projectId || itemProject.id;
          const fullProject = getFullProject(projectId) || itemProject;

          // Получаем название проекта
          const projectName = fullProject.name || itemProject.name || "Проект";

          // Рассчитываем прогресс проекта
          const projectProgress = calculateProjectProgress(fullProject);

          // Получаем даты проекта и задачи
          const projectStartDate =
            fullProject.startDate || itemProject.startDate;
          const projectEndDate = fullProject.endDate || itemProject.endDate;
          const taskStartDate = task.startDate || projectStartDate;
          const taskEndDate = task.endDate || projectEndDate;

          return (
            <div
              key={task.id || `task-${index}`}
              className="border rounded-lg p-4 bg-white"
            >
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
                  {projectName}
                </div>
              </div>

              {/* Даты и прогресс проекта */}
              <div className="mt-3 mb-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" className="h-3 w-3" />
                    <span>
                      Проект: {formatDate(projectStartDate)} —{" "}
                      {formatDate(projectEndDate)}
                    </span>
                  </div>
                  <span>{projectProgress}% выполнено</span>
                </div>
                <Progress
                  value={projectProgress}
                  className="h-1.5"
                  indicatorClassName={getProgressColorClass(projectProgress)}
                />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" className="h-3 w-3" />
                  <span>Начало задачи: {formatDate(taskStartDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="CalendarClock" className="h-3 w-3" />
                  <span>Окончание задачи: {formatDate(taskEndDate)}</span>
                </div>
                {task.estimatedTime !== undefined && (
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" className="h-3 w-3" />
                    <span>Время: {task.estimatedTime || 0} ч.</span>
                  </div>
                )}
                {task.price !== undefined && (
                  <div className="flex items-center gap-1">
                    <Icon name="CircleDollarSign" className="h-3 w-3" />
                    <span>Цена: {task.price || 0} ₽</span>
                  </div>
                )}
              </div>

              {/* Показываем назначенных исполнителей */}
              {renderAssignedUsers(task)}

              <Button
                onClick={() => onTakeTask(task.id, projectId)}
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
