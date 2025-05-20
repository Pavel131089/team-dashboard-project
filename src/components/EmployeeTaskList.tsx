import React, { useState } from "react";
import TasksTable from "./employee/task/TasksTable";
import { Task } from "@/types/project";

interface EmployeeTaskListProps {
  tasks: { project: any; task: Task }[];
  userId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const EmployeeTaskList: React.FC<EmployeeTaskListProps> = ({
  tasks,
  userId,
  onTaskUpdate,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Обработчик для тоггла развернутой задачи
  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <TasksTable
      tasks={tasks}
      expandedTaskId={expandedTaskId}
      onToggleExpand={toggleTaskExpanded}
      onTaskUpdate={onTaskUpdate}
    />
  );
};

export default EmployeeTaskList;
