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
  console.log("AvailableTasksSection получил tasks:", tasks);
  console.log("AvailableTasksSection получил projects:", projects);

  // Создаем тестовые данные, чтобы проверить отображение
  const testTasks = [
    {
      task: {
        id: "test-task-1",
        name: "Тестовая задача 1",
        description: "Описание тестовой задачи 1",
        price: 5000,
        estimatedTime: 8,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "",
        assignedToNames: [],
        progress: 0,
      },
      project: {
        id: "test-project-1",
        name: "Тестовый проект 1",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          // Задачи проекта для расчета прогресса
          { progress: 100 },
          { progress: 50 },
          { progress: 0 },
        ],
      },
    },
    {
      task: {
        id: "test-task-2",
        name: "Тестовая задача 2",
        description: "Описание тестовой задачи 2",
        price: 7500,
        estimatedTime: 12,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "",
        assignedToNames: [],
        progress: 0,
      },
      project: {
        id: "test-project-2",
        name: "Тестовый проект 2",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          // Задачи проекта для расчета прогресса
          { progress: 80 },
          { progress: 30 },
        ],
      },
    },
  ];

  // Используем тестовые данные или данные из props
  const displayTasks = tasks && tasks.length > 0 ? tasks : testTasks;

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
        {displayTasks.map((item, index) => {
          // Извлекаем task и project из структуры
          const task = item.task || {};
          const project = item.project || {};

          // Рассчитываем прогресс проекта
          const projectProgress = calculateProjectProgress(project);

          return (
            <div
              key={task.id || `test-${index}`}
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
                  {project.name || "Проект"}
                </div>
              </div>

              {/* Даты и прогресс проекта */}
              <div className="mt-3 mb-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" className="h-3 w-3" />
                    <span>
                      Проект: {formatDate(project.startDate)} —{" "}
                      {formatDate(project.endDate)}
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
                  <span>Начало задачи: {formatDate(task.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="CalendarClock" className="h-3 w-3" />
                  <span>Окончание задачи: {formatDate(task.endDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Clock" className="h-3 w-3" />
                  <span>Время: {task.estimatedTime || 0} ч.</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="CircleDollarSign" className="h-3 w-3" />
                  <span>Цена: {task.price || 0} ₽</span>
                </div>
              </div>

              <Button
                onClick={() =>
                  onTakeTask(
                    task.id || `test-${index}`,
                    project.id || `test-project-${index}`,
                  )
                }
                className="w-full mt-3"
                size="sm"
              >
                <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                Взять в работу
              </Button>
            </div>
          );
        })}

        {displayTasks.length === 0 && <EmptyAvailableTasks />}
      </CardContent>
    </Card>
  );
};

export default AvailableTasksSection;
