
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import TaskRow from "./TaskRow";
import TaskExpandedInfo from "./TaskExpandedInfo";
import { Task } from "@/types/project";

interface TasksTableProps {
  tasks: { project: any; task: Task }[];
  expandedTaskId: string | null;
  onToggleExpand: (taskId: string) => void;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  expandedTaskId,
  onToggleExpand,
  onTaskUpdate,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Icon name="ClipboardList" className="mx-auto h-10 w-10 opacity-20" />
        <p className="mt-2">У вас пока нет назначенных задач</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Задача</TableHead>
            <TableHead className="w-[120px]">Проект</TableHead>
            <TableHead className="w-[120px]">План. начало</TableHead>
            <TableHead className="w-[120px]">План. конец</TableHead>
            <TableHead className="w-[120px]">Взята в работу</TableHead>
            <TableHead className="w-[120px]">Выполнена</TableHead>
            <TableHead className="w-[180px]">Прогресс</TableHead>
            <TableHead className="w-[60px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(({ project, task }) => (
            <React.Fragment key={task.id}>
              <TaskRow
                task={task}
                project={project}
                isExpanded={expandedTaskId === task.id}
                onToggleExpand={() => onToggleExpand(task.id)}
                onTaskUpdate={onTaskUpdate}
              />

              {/* Развернутая информация о задаче */}
              {expandedTaskId === task.id && (
                <TableRow>
                  <TableCell colSpan={8} className="bg-muted/30 px-4 py-3">
                    <TaskExpandedInfo 
                      task={task} 
                      projectId={project.id}
                      onTaskUpdate={onTaskUpdate}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;
