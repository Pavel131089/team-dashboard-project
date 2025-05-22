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
import TaskRow from "@/components/employee/TaskRow";
import TaskExpandedInfo from "@/components/employee/TaskExpandedInfo";
import { Task } from "@/types/project";
import { hasTaskComments } from "@/utils/taskUtils";

interface TasksTableProps {
  tasks: { project: any; task: Task }[];
  userId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  userId,
  onTaskUpdate,
}) => {
  const [expandedTaskId, setExpandedTaskId] = React.useState<string | null>(
    null,
  );

  // Обработчик для тоггла развернутой задачи
  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Обновление прогресса задачи
  const handleProgressChange = (
    projectId: string,
    task: Task,
    newProgress: number,
  ) => {
    const updatedTask = { ...task, progress: newProgress };

    // Если прогресс достиг 100%, устанавливаем дату завершения
    if (newProgress === 100 && !updatedTask.actualEndDate) {
      updatedTask.actualEndDate = new Date().toISOString();
    } else if (newProgress < 100 && updatedTask.actualEndDate) {
      // Если прогресс упал ниже 100%, удаляем дату завершения
      updatedTask.actualEndDate = null;
    }

    // Если задача еще не начата и есть изменение прогресса, устанавливаем дату начала
    if (newProgress > 0 && !updatedTask.actualStartDate) {
      updatedTask.actualStartDate = new Date().toISOString();
    }

    onTaskUpdate(projectId, updatedTask);
  };

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
                onToggleExpand={() => toggleTaskExpanded(task.id)}
                hasComments={hasTaskComments(task)}
                onProgressChange={(newProgress) =>
                  handleProgressChange(project.id, task, newProgress)
                }
              />

              {expandedTaskId === task.id && (
                <TaskExpandedInfo
                  task={task}
                  projectId={project.id}
                  onUpdateTask={(updatedTask) =>
                    onTaskUpdate(project.id, updatedTask)
                  }
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;
