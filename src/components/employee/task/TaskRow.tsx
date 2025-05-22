import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ProjectInfoBadge from "@/components/employee/ProjectInfoBadge";
import TaskProgressControl from "./TaskProgressControl";
import { formatDate } from "@/utils/dateUtils";
import { hasComments } from "@/utils/taskUtils";
import { processProgressChange } from "@/utils/progressUtils";
import { getAssigneeNames } from "@/utils/userUtils";
import { Task } from "@/types/project";

interface TaskRowProps {
  task: Task;
  project: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  project,
  isExpanded,
  onToggleExpand,
  onTaskUpdate,
}) => {
  // Обработчик изменения прогресса задачи
  const handleProgressChange = (newProgress: number) => {
    const updatedTask = processProgressChange(task, newProgress);
    onTaskUpdate(project.id, updatedTask);
  };

  // В компоненте можно добавить отображение имен исполнителей
  const assignedToDisplay = getAssigneeNames(task.assignedToNames);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-1">
          {task.name}
          {hasComments(task) && (
            <Badge variant="outline" className="ml-1 px-1">
              <Icon name="MessageSquare" className="h-3 w-3" />
            </Badge>
          )}
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {task.description}
          </p>
        )}
        {assignedToDisplay && (
          <p className="text-xs text-muted-foreground mt-1">
            {assignedToDisplay}
          </p>
        )}
      </TableCell>
      <TableCell>
        <ProjectInfoBadge project={project} />
      </TableCell>
      <TableCell>{formatDate(task.startDate)}</TableCell>
      <TableCell>{formatDate(task.endDate)}</TableCell>
      <TableCell>{formatDate(task.actualStartDate)}</TableCell>
      <TableCell>{formatDate(task.actualEndDate)}</TableCell>
      <TableCell>
        <TaskProgressControl
          progress={task.progress || 0}
          onProgressChange={handleProgressChange}
        />
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" onClick={onToggleExpand}>
          <Icon
            name={isExpanded ? "ChevronUp" : "ChevronDown"}
            className="h-4 w-4"
          />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
