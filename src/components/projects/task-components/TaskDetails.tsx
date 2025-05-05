
import React from "react";
import { Task } from "@/types/project";
import Icon from "@/components/ui/icon";

interface TaskDetailsProps {
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const showMultipleAssignees = Array.isArray(task.assignedTo) && task.assignedTo.length > 1;
  
  return (
    <div>
      <div className="font-medium">{task.name}</div>
      <div className="text-xs text-slate-500 mt-1">{task.description}</div>
      
      {showMultipleAssignees && (
        <div className="mt-1 text-xs inline-flex items-center bg-purple-100 text-purple-800 rounded px-2 py-0.5">
          <Icon name="Users" className="h-3 w-3 mr-1" />
          Выполняют {task.assignedTo.length} сотрудников
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
