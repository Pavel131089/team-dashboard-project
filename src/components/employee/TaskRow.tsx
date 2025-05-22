import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ProjectInfoBadge from "@/components/employee/ProjectInfoBadge";
import { Task } from "@/types/project";
import { formatDate } from "@/utils/dateUtils";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { getProgressColorClass } from "@/utils/progressUtils";

interface TaskRowProps {
  task: Task;
  project: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hasComments: boolean;
  onProgressChange: (newProgress: number) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  project,
  isExpanded,
  onToggleExpand,
  hasComments,
  onProgressChange,
}) => {
  // Безопасно получаем текущий прогресс
  const currentProgress = task.progress || 0;

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
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs">{currentProgress}%</span>
          </div>

          <div className="flex">
            <Slider
              value={[currentProgress]}
              min={0}
              max={100}
              step={5}
              className="mb-2"
              onValueChange={(values) => onProgressChange(values[0])}
            />
          </div>

          <Progress
            value={currentProgress}
            className="h-2"
            indicatorClassName={getProgressColorClass(currentProgress)}
          />
        </div>
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
