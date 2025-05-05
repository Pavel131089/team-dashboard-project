}import { TableCell, TableRow } from '@/components/ui/table'; import { Button } from '@/components/ui/button'; import Icon from '@/components/ui/icon'; import { Task } from '@/types/project'; import { useState } from 'react'; import { Textarea } from '@/components/ui/textarea'; import { toast } from '@/components/ui/use-toast'; import TaskStatusBadge from './TaskStatusBadge'; import TaskDates from './TaskDates'; import TaskProgress from './TaskProgress'; import TaskComments from './TaskComments';

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
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleProgressChange = (projectId: string, progress: number) => {
    if (onTaskUpdate && project) {
      const updatedTask = { ...task, progress };
      onTaskUpdate(projectId, updatedTask);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Комментарий не может быть пустым',
        variant: 'destructive'
      });
      return;
    }

    if (onTaskUpdate && project) {
      const comments = task.comments || [];
      const updatedTask = {
        ...task,
        comments: [...comments, newComment]
      };
      onTaskUpdate(project.id, updatedTask);
      setNewComment('');
      setShowAddComment(false);
      
      toast({
        title: 'Комментарий добавлен',
        description: 'Ваш комментарий был успешно добавлен к задаче'
      });
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className=