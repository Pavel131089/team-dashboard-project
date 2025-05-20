
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ProjectInfoBadge from "@/components/employee/ProjectInfoBadge";
import { Task } from "@/types/project";
import { formatDate } from "@/utils/dateUtils";

interface TaskRowProps {
  task: Task;
  project: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hasComments: boolean;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  project,
  isExpanded,
  onToggleExpand,
  hasComments,
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-1">
          {task.name}
          {hasComments && (
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
          onProgressChange={(newProgress) => {
            // Эта функция будет передана через пропсы
            // и вызвана здесь для обновления прогресса
          }}
        />
      </TableCell>
      
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
        >
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
