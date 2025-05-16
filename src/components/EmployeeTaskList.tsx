import React, { useState } from "react";
import { Task } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import ProjectInfoBadge from "@/components/employee/ProjectInfoBadge";
import { formatDate } from "@/components/utils/FormatUtils";

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
  const [progressValues, setProgressValues] = useState<Record<string, number>>(
    {},
  );

  const handleProgressChange = (taskId: string, value: number) => {
    setProgressValues({
      ...progressValues,
      [taskId]: value,
    });
  };

  const handleUpdateProgress = (projectId: string, task: Task) => {
    const newProgress =
      progressValues[task.id] !== undefined
        ? progressValues[task.id]
        : task.progress || 0;

    onTaskUpdate(projectId, {
      ...task,
      progress: newProgress,
    });

    // Очищаем значение в стейте после обновления
    const updatedValues = { ...progressValues };
    delete updatedValues[task.id];
    setProgressValues(updatedValues);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Icon
          name="ClipboardCheck"
          className="h-12 w-12 text-muted-foreground/50"
        />
        <h3 className="mt-4 text-lg font-medium">У вас нет задач</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          На данный момент вам не назначено ни одной задачи
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Задача</TableHead>
            <TableHead className="w-[20%]">Проект</TableHead>
            <TableHead className="w-[20%]">Дата</TableHead>
            <TableHead className="w-[20%]">Прогресс</TableHead>
            <TableHead className="w-[10%]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(({ project, task }) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">{task.name}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="max-w-xs space-y-1">
                        <p className="font-medium">{task.name}</p>
                        <p className="text-xs">
                          {task.description || "Нет описания"}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell>
                <ProjectInfoBadge project={project} />
              </TableCell>

              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Icon
                      name="Calendar"
                      className="h-3 w-3 text-muted-foreground"
                    />
                    <span>{formatDate(task.startDate)}</span>
                  </div>
                  {task.endDate && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Icon
                        name="CalendarClock"
                        className="h-3 w-3 text-muted-foreground"
                      />
                      <span>{formatDate(task.endDate)}</span>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="h-8 w-16"
                    value={
                      progressValues[task.id] !== undefined
                        ? progressValues[task.id]
                        : task.progress || 0
                    }
                    onChange={(e) =>
                      handleProgressChange(
                        task.id,
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                  />
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${
                            progressValues[task.id] !== undefined
                              ? progressValues[task.id]
                              : task.progress || 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpdateProgress(project.id, task)}
                >
                  <Icon name="Save" className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTaskList;
