
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TaskStatusProps {
  progress: number;
  assignedTo: string | string[] | null;
}

const TaskStatus: React.FC<TaskStatusProps> = ({ progress, assignedTo }) => {
  if (progress === 100) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
        Завершено
      </Badge>
    );
  } 
  
  if (assignedTo) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        В работе
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
      Ожидает
    </Badge>
  );
};

export default TaskStatus;
