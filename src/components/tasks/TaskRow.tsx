import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Task } from "@/types/project";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskDates from "./TaskDates";
import TaskProgress from "./TaskProgress";
import TaskComments from "./TaskComments";

interface TaskRowProps {
  task: Task;
  project: any;
  onDeleteTask?: (projectId: string, taskId: string) => void;
  onTaskUpdate?: (projectId: string, task: Task) => void;
}

/**
 * Определяет название проекта для отображения
 */
const getProjectName = (task: Task, project: any) => {
  // Если у задачи есть projectName
  if (task.projectName) return task.projectName;
  
  // Если задача пришла с проектом в объекте
  if (project) {
    return project.name || "—";
  }
  
  return "—";
};

/**
 * Компонент строки задачи для таблицы
 */
const TaskRow = ({ task, project, onDeleteTask, onTaskUpdate }: TaskRowProps) => {
  const handleProgressChange = (projectId: string, progress: number) => {
    if (onTaskUpdate && project) {
      const updatedTask = {...task, progress};
      onTaskUpdate(projectId, updatedTask);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>{task.name || "—"}</div>
        <div className="text-xs text-slate-500 mt-1">
          {task.description || "—"}
        </div>
        <TaskComments comments={task.comments} />
      </TableCell>
      <TableCell>
        {getProjectName(task, project)}
      </TableCell>
      <TableCell>
        <TaskStatusBadge isCompleted={task.progress === 100} />
      </TableCell>
      <TableCell>
        <TaskDates 
          startDate={task.startDate}
          endDate={task.endDate}
          actualStartDate={task.actualStartDate}
          actualEndDate={task.actualEndDate}
        />
      </TableCell>
      <TableCell>
        <TaskProgress 
          progress={task.progress || 0}
          projectId={project?.id}
          onProgressChange={handleProgressChange}
          task={task}
        />
      </TableCell>
      <TableCell>
        {task.progress === 100 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => project && onDeleteTask && onDeleteTask(project.id, task.id)}
            disabled={!project}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;