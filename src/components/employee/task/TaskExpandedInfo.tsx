
import React from "react";
import Icon from "@/components/ui/icon";
import TaskComments from "./TaskComments";
import { Task } from "@/types/project";

interface TaskExpandedInfoProps {
  task: Task;
  projectId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const TaskExpandedInfo: React.FC<TaskExpandedInfoProps> = ({
  task,
  projectId,
  onTaskUpdate,
}) => {
  return (
    <div className="space-y-2">
      {/* Дополнительная информация о задаче */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        {task.price !== undefined && task.price !== null && (
          <div className="flex items-center gap-1">
            <Icon
              name="CircleDollarSign"
              className="h-4 w-4 text-muted-foreground"
            />
            <span className="text-muted-foreground">Цена:</span>
            <span>{task.price} ₽</span>
          </div>
        )}
        {task.estimatedTime !== undefined && task.estimatedTime !== null && (
          <div className="flex items-center gap-1">
            <Icon
              name="Clock"
              className="h-4 w-4 text-muted-foreground"
            />
            <span className="text-muted-foreground">
              Оценка времени:
            </span>
            <span>{task.estimatedTime} ч</span>
          </div>
        )}
      </div>

      {/* Компонент работы с комментариями */}
      <TaskComments
        task={task}
        onUpdateTask={(updatedTask) => onTaskUpdate(projectId, updatedTask)}
      />
    </div>
  );
};

export default TaskExpandedInfo;
