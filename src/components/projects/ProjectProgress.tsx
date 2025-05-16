import React from "react";
import { Project, Task } from "@/types/project";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface ProjectProgressProps {
  project: Project;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ project }) => {
  // Рассчитываем общий прогресс на основе задач в проекте
  const calculateProgress = (tasks: Task[]): number => {
    // Если задач нет, возвращаем 0%
    if (!tasks || tasks.length === 0) return 0;

    // Суммируем прогресс всех задач и делим на их количество
    const totalProgress = tasks.reduce(
      (sum, task) => sum + (task.progress || 0),
      0,
    );
    return Math.round(totalProgress / tasks.length);
  };

  // Рассчитываем количество выполненных задач (задач с прогрессом 100%)
  const countCompletedTasks = (tasks: Task[]): number => {
    return tasks.filter((task) => task.progress === 100).length;
  };

  // Рассчитываем общую стоимость всех задач
  const calculateTotalCost = (tasks: Task[]): number => {
    return tasks.reduce((sum, task) => sum + (task.price || 0), 0);
  };

  const progressPercent = calculateProgress(project.tasks);
  const completedTasks = countCompletedTasks(project.tasks);
  const totalTasks = project.tasks.length;
  const totalCost = calculateTotalCost(project.tasks);

  // Определяем цвет прогресс-бара в зависимости от значения
  const getProgressColorClass = (percent: number): string => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex items-center gap-1.5">
          <Icon name="ListChecks" className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Всего задач:</span>
          <span className="text-sm font-medium">{totalTasks}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Icon name="CheckCircle2" className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Выполнено:</span>
          <span className="text-sm font-medium">{completedTasks}</span>
          <span className="text-xs text-muted-foreground">
            (
            {totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0}
            %)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Icon name="BarChart2" className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Прогресс проекта:
          </span>
          <span className="text-sm font-medium">{progressPercent}%</span>
        </div>
      </div>

      <Progress
        value={progressPercent}
        className="h-2 w-full bg-secondary"
        // Применяем нужный класс цвета к индикатору прогресса
        indicatorClassName={getProgressColorClass(progressPercent)}
      />
    </div>
  );
};

export default ProjectProgress;
