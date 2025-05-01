import { Task } from "@/types/project";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteConfirmationDialog from "@/components/ui/delete-confirmation-dialog";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import TaskRow from "./tasks/TaskRow";

interface EmployeeTaskListProps {
  tasks: {project: any, task: Task}[] | Task[];
  userId: string;
  onTaskUpdate?: (projectId: string, task: Task) => void;
}

/**
 * Компонент для отображения списка задач сотрудника
 */
const EmployeeTaskList = ({ tasks, userId, onTaskUpdate }: EmployeeTaskListProps) => {
  const [taskToDelete, setTaskToDelete] = useState<{projectId: string, taskId: string} | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Нормализация задач в единый формат
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
    // Фильтрация задач, назначенных этому сотруднику
    if (Array.isArray(task.assignedTo)) {
      return task.assignedTo.includes(userId);
    }
    return task.assignedTo === userId;
  });
  
  /**
   * Обработчик удаления задачи
   */
  const handleDeleteTask = (projectId: string, taskId: string) => {
    setTaskToDelete({ projectId, taskId });
    setIsDeleteDialogOpen(true);
  };

  /**
   * Подтверждение удаления задачи
   */
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

  // Если нет задач для отображения
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
            <TaskRow 
              key={task.id || index}
              task={task}
              project={project}
              onDeleteTask={handleDeleteTask}
              onTaskUpdate={onTaskUpdate}
            />
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