import React, { useMemo } from "react";
import { Task, Project } from "@/types/project";
import Icon from "@/components/ui/icon";
import EmptyAvailableTasks from "@/components/employee/EmptyAvailableTasks";
import AvailableTaskItem from "@/components/employee/AvailableTaskItem";
import ProjectInfoHeader from "@/components/employee/ProjectInfoHeader";

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
  // Безопасно группируем задачи по проектам
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
          // Находим полную информацию о проекте
          // Проверяем, что projects - это массив перед вызовом find
          const fullProject = Array.isArray(projects)
            ? projects.find((p) => p.id === projectId)
            : undefined;

          projectMap[projectId] = {
            projectId,
            projectName,
            tasks: [],
            project: fullProject,
          };
        }

        // Добавляем задачу в соответствующий проект
        projectMap[projectId].tasks.push(task);
      });

      // Преобразуем объект в массив для отображения
      return Object.values(projectMap);
    } catch (error) {
      console.error("Ошибка при группировке задач:", error);
      return [];
    }
  }, [tasks, projects]);

  // Если нет доступных задач, показываем пустое состояние
  if (!projectsWithTasks.length) {
    return <EmptyAvailableTasks />;
  }

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
            {/* Добавляем компонент для информации о проекте с датами */}
            <ProjectInfoHeader
              project={projectInfo.project}
              projectName={projectInfo.projectName}
            />

            <div className="p-4">
              <div className="space-y-3">
                {projectInfo.tasks.map((task) => (
                  <AvailableTaskItem
                    key={
                      task.id ||
                      `task-${Math.random().toString(36).substring(2, 11)}`
                    }
                    task={task}
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
