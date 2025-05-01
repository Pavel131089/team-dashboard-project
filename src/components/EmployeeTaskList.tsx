import { Task } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DeleteConfirmationDialog from "@/components/ui/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface EmployeeTaskListProps {
  tasks: {project: any, task: Task}[] | Task[];
  userId: string;
  onTaskUpdate?: (projectId: string, task: Task) => void;
}


  const [taskToDelete, setTaskToDelete] = useState<{projectId: string, taskId: string} | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  // Фильтрация задач, назначенных этому сотруднику
  const employeeTasks = tasks.map(item => {
    if ('task' in item) {
      return {
        task: item.task,
        project: item.project
      };
    }
    return {
      task: item,
      project: null
    };
  }).filter(({ task }) => {
    if (Array.isArray(task.assignedTo)) {
      return task.assignedTo.includes(userId);
    }
    return task.assignedTo === userId;
  });
  
  const handleDeleteTask = (projectId: string, taskId: string) => {
    setTaskToDelete({ projectId, taskId });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete && onTaskUpdate) {
      // Находим задачу, которую нужно удалить
      const taskItem = employeeTasks.find(({ task }) => task.id === taskToDelete.taskId);
      if (taskItem && taskToDelete.projectId) {
        // Создаем копию задачи с флагом удаления
        const taskWithDeleteFlag = { ...taskItem.task, _deleted: true };
        onTaskUpdate(taskToDelete.projectId, taskWithDeleteFlag);
        toast({
          title: "Задача удалена",
          description: `Задача "${taskItem.task.name}" была успешно удалена.`,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const getProjectName = (task: Task, taskItem: {project: any}) => {
    // Если у задачи есть projectName
    if (task.projectName) return task.projectName;
    
    // Если задача пришла с проектом в объекте
    if (taskItem.project) {
      return taskItem.project.name || "—";
    }
    
    return "—";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (employeeTasks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-500">Нет назначенных задач для сотрудника</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Задачи сотрудника:</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Проект</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Даты</TableHead>
            <TableHead>Прогресс</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeTasks.map(({ task, project }, index) => (
            <TableRow key={task.id || index}>
              <TableCell className="font-medium">
                <div>{task.name || "—"}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {task.description || "—"}
                </div>
                {task.comments && task.comments.length > 0 && (
                  <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {task.comments.map((comment, index) => (
                        <li key={index} className="text-gray-600">{comment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {getProjectName(task, { project })}
              </TableCell>
              <TableCell>
                {task.progress === 100 ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Завершено
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    В работе
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  <div>План: {formatDate(task.startDate)} — {formatDate(task.endDate)}</div>
                  {task.actualStartDate && (
                    <div className="mt-1">
                      Факт: {formatDate(task.actualStartDate)} 
                      {task.actualEndDate ? ` — ${formatDate(task.actualEndDate)}` : ""}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-full flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={task.progress || 0} 
                      className="h-2 w-24"
                      indicatorClassName={getProgressColor(task.progress || 0)}
                    />
                    <span className="text-xs">{task.progress || 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={task.progress || 0}
                    onChange={(e) => {
                      if (onTaskUpdate && project) {
                        const updatedTask = {...task, progress: parseInt(e.target.value)};
                        onTaskUpdate(project.id, updatedTask);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </TableCell>
              <TableCell>
                {task.progress === 100 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => project && handleDeleteTask(project.id, task.id)}
                    disabled={!project}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Удалить задачу"
        description="Вы уверены, что хотите удалить задачу? Это действие нельзя отменить."
      />
    </div>
  );
};

export default EmployeeTaskList;