import React, { useMemo } from "react";
import { Task, Project } from "@/types/project";
import Icon from "@/components/ui/icon";
import EmptyAvailableTasks from "@/components/employee/EmptyAvailableTasks";
import AvailableTaskItem from "@/components/employee/AvailableTaskItem";

interface TaskWithProject extends Task {
  projectId: string;
  projectName: string;
}

interface AvailableTasksSectionProps {
  tasks: TaskWithProject[];
  onTakeTask: (taskId: string, projectId: string) => void;
  projects?: Project[]; // Добавляем доступ ко всем проектам
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({
  tasks,
  onTakeTask,
  projects = [], // Значение по умолчанию - пустой массив
}) => {
  // Создаем объект проектов для быстрого доступа
  const projectsMap = useMemo(() => {
    const map: Record<string, Project> = {};
    if (Array.isArray(projects)) {
      projects.forEach((project) => {
        if (project?.id) {
          map[project.id] = project;
        }
      });
    }
    return map;
  }, [projects]);

  // Правильно обрабатываем задачи, чтобы передать информацию о датах проекта
  const projectsWithTasks = useMemo(() => {
    // Проверяем, что tasks это массив
    if (!Array.isArray(tasks)) {
      console.error("tasks не является массивом в AvailableTasksSection");
      return [];
    }

    try {
      // Создаем структуру для группировки задач по проектам
      const projectMap: Record<
        string,
        {
          projectId: string;
          projectName: string;
          tasks: TaskWithProject[];
          project?: Project; // Добавляем ссылку на полную информацию о проекте
        }
      > = {};

      // Проходим по всем задачам и группируем их по projectId
      tasks.forEach((task) => {
        // Пропускаем задачи без projectId
        if (!task?.projectId) {
          return;
        }

        const projectId = task.projectId;
        const projectName = task.projectName || "Без названия";

        // Создаем запись для проекта, если ее еще нет
        if (!projectMap[projectId]) {
          // Находим полную информацию о проекте из нашей карте
          const fullProject = projectsMap[projectId];

          projectMap[projectId] = {
            projectId,
            projectName,
            tasks: [],
            project: fullProject,
          };
        }

        // Добавляем задачу в соответствующий проект с датами проекта
        const projectDates = projectMap[projectId].project || {};

        // Создаем задачу с информацией о проекте
        const taskWithProjectInfo = {
          ...task,
          projectStartDate: projectDates.startDate || task.projectStartDate,
          projectEndDate: projectDates.endDate || task.projectEndDate,
        };

        projectMap[projectId].tasks.push(taskWithProjectInfo);
      });

      // Преобразуем объект в массив для отображения
      return Object.values(projectMap);
    } catch (error) {
      console.error("Ошибка при группировке задач:", error);
      return [];
    }
  }, [tasks, projectsMap]);

  // Если нет доступных задач, показываем пустое состояние
  if (!projectsWithTasks.length) {
    return <EmptyAvailableTasks />;
  }

  // Функция для форматирования даты
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Не указано";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Неверный формат";
      return date.toLocaleDateString("ru-RU");
    } catch (error) {
      return "Неверный формат";
    }
  };

  // Правильно передаем задачи с информацией о проекте
  return (
    <div className="mt-6 lg:mt-0">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Briefcase" className="text-primary h-5 w-5" />
        <h2 className="text-xl font-medium">Доступные задачи</h2>
      </div>

      <div className="space-y-4">
        {projectsWithTasks.map((projectInfo) => (
          <div
            key={projectInfo.projectId || `project-${Math.random()}`}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {/* Показываем информацию о проекте с датами */}
            <div className="bg-slate-50 p-3 border-b">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg flex items-center">
                  <Icon
                    name="Briefcase"
                    className="h-5 w-5 mr-2 text-primary"
                  />
                  {projectInfo.projectName}
                </h3>
              </div>

              {/* Даты проекта */}
              <div className="flex flex-wrap gap-x-4 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Начало:</span>
                  <span>
                    {projectInfo.project?.startDate
                      ? formatDate(projectInfo.project.startDate)
                      : "Не указано"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Окончание:</span>
                  <span>
                    {projectInfo.project?.endDate
                      ? formatDate(projectInfo.project.endDate)
                      : "Не указано"}
                  </span>
                </div>
              </div>

              {projectInfo.project?.description && (
                <p className="text-sm text-slate-600 mt-1 mb-2">
                  {projectInfo.project.description}
                </p>
              )}
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {projectInfo.tasks.map((task) => (
                  <AvailableTaskItem
                    key={
                      task.id ||
                      `task-${Math.random().toString(36).substring(2, 11)}`
                    }
                    task={{
                      ...task,
                      // Явно передаем даты проекта в задачу
                      projectStartDate: projectInfo.project?.startDate,
                      projectEndDate: projectInfo.project?.endDate,
                    }}
                    projectName={projectInfo.projectName}
                    onTakeTask={() => {
                      if (task.id && task.projectId) {
                        onTakeTask(task.id, task.projectId);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableTasksSection;
