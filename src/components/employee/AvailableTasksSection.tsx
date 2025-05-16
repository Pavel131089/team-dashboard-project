import React, { useMemo } from "react";
import { Project, Task } from "@/types/project";
import AvailableTaskItem from "@/components/employee/AvailableTaskItem";
import Icon from "@/components/ui/icon";
import EmptyAvailableTasks from "@/components/employee/EmptyAvailableTasks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface AvailableTasksSectionProps {
  projects: Project[];
  userId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({
  projects,
  userId,
  onTaskUpdate,
}) => {
  // Группируем доступные задачи по проектам
  const availableTasksByProject = useMemo(() => {
    const result: { project: Project; tasks: Task[] }[] = [];

    projects.forEach((project) => {
      const availableTasks = project.tasks.filter((task) => {
        // Задача доступна, если она не назначена на пользователя
        if (!task.assignedTo) return true;

        if (Array.isArray(task.assignedTo)) {
          return !task.assignedTo.includes(userId);
        }

        return task.assignedTo !== userId;
      });

      if (availableTasks.length > 0) {
        result.push({
          project,
          tasks: availableTasks,
        });
      }
    });

    return result;
  }, [projects, userId]);

  // Общее количество доступных задач
  const totalAvailableTasks = useMemo(() => {
    return availableTasksByProject.reduce(
      (total, item) => total + item.tasks.length,
      0,
    );
  }, [availableTasksByProject]);

  if (totalAvailableTasks === 0) {
    return <EmptyAvailableTasks />;
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Icon name="ListChecks" className="mr-2 h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">
          Доступные задачи ({totalAvailableTasks})
        </h3>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {availableTasksByProject.map(({ project, tasks }) => (
          <AccordionItem
            key={project.id}
            value={project.id}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="FolderOpen" className="h-5 w-5 text-primary" />
                  <span>{project.name}</span>
                </div>
                <Badge variant="outline">
                  {tasks.length}{" "}
                  {tasks.length === 1
                    ? "задача"
                    : tasks.length < 5
                      ? "задачи"
                      : "задач"}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div>
                {tasks.map((task) => (
                  <AvailableTaskItem
                    key={task.id}
                    project={project}
                    task={task}
                    userId={userId}
                    onAssignTask={onTaskUpdate}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AvailableTasksSection;
