
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
  // Сгруппируем задачи по проектам для более удобного отображения
  const tasksByProject = useMemo(() => {
    const result: Record<string, { projectName: string; tasks: TaskWithProject[] }> = {};
    
    // Проверяем, что tasks это массив
    if (!Array.isArray(tasks)) {
      return {};
    }

    // Группируем задачи по projectId
    tasks.forEach(task => {
      if (!task.projectId) return;
      
      if (!result[task.projectId]) {
        result[task.projectId] = {
          projectName: task.projectName || 'Неизвестный проект',
          tasks: []
        };
      }
      
      result[task.projectId].tasks.push(task);
    });
    
    return result;
  }, [tasks]);

  // Получаем массив проектов с задачами
  const projectsWithTasks = useMemo(() => {
    return Object.entries(tasksByProject).map(([projectId, data]) => ({
      projectId,
      projectName: data.projectName,
      tasks: data.tasks
    }));
  }, [tasksByProject]);

  // Если нет доступных задач, показываем пустое состояние
  if (projectsWithTasks.length === 0) {
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
          <div key={project.projectId} className="bg-white rounded-lg shadow-sm border p-4">
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
                  onTakeTask={() => onTakeTask(task.id, task.projectId)}
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
