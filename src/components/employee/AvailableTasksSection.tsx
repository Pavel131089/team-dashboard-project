import React, { useMemo } from "react";
import { Task } from "@/types/project";
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
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({
  tasks,
  onTakeTask,
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
          projectMap[projectId] = {
            projectId,
            projectName,
            tasks: [],
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
  }, [tasks]);

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
        {projectsWithTasks.map((project) => (
          <div
            key={project.projectId}
            className="bg-white rounded-lg shadow-sm border p-4"
          >
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Icon name="Folder" className="h-4 w-4 mr-2 text-primary" />
              {project.projectName}
            </h3>

            <div className="space-y-3">
              {project.tasks.map((task) => (
                <AvailableTaskItem
                  key={task.id}
                  task={task}
                  projectName={project.projectName}
                  onTakeTask={() => {
                    if (task.id && task.projectId) {
                      onTakeTask(task.id, task.projectId);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableTasksSection;
