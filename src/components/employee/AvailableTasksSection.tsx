
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  projects = []
}) => {
  // Создаем карту проектов для быстрого доступа
  const projectsMap = useMemo(() => {
    const map: Record<string, Project> = {};
    if (Array.isArray(projects)) {
      projects.forEach(project => {
        if (project?.id) {
          map[project.id] = project;
        }
      });
    }
    return map;
  }, [projects]);

  // Форматируем дату для отображения
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

  // Проверяем, есть ли доступные задачи
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <EmptyAvailableTasks />;
  }

  // Для отладки - выводим информацию о задачах
  console.log("Available tasks in section:", tasks.map(t => ({
    taskId: t.task.id,
    taskName: t.task.name,
    projectId: t.project?.id,
    projectName: t.project?.name,
    projectStartDate: t.project?.startDate,
    projectEndDate: t.project?.endDate,
    taskStartDate: t.task.startDate,
    taskEndDate: t.task.endDate
  })));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon name="Briefcase" className="text-primary h-5 w-5" />
          <CardTitle>Доступные задачи</CardTitle>
        </div>
        <CardDescription>Задачи, которые вы можете взять в работу</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(({ task, project }) => {
          // Получаем полную информацию о проекте из карты проектов, если доступно
          const fullProject = project?.id ? projectsMap[project.id] || project : project;
          
          // Для отладки - выводим информацию о задаче и ее проекте
          console.log(`Rendering available task ${task.id || task.name}:`, {
            projectFromTasks: project,
            projectFromMap: fullProject,
            taskStartDate: task.startDate,
            taskEndDate: task.endDate,
            projectStartDate: fullProject?.startDate,
            projectEndDate: fullProject?.endDate
          });
          
          // Используем даты проекта, если даты задачи отсутствуют
          const startDate = task.startDate || fullProject?.startDate;
          const endDate = task.endDate || fullProject?.endDate;
          
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
                  {fullProject?.name || "Проект"}
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
                onClick={() => onTakeTask(task.id, fullProject?.id || "")}
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
