
import React, { useState } from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";
import TaskCommentForm from "./TaskCommentForm";

interface AvailableTasksSectionProps {
  projects: Project[];
  userId: string;
  onTaskUpdate: (projectId: string, task: Task) => void;
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({ 
  projects, 
  userId,
  onTaskUpdate 
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  
  const availableTasks = collectAvailableTasks(projects, userId);
  
  const handleAssignTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId)!;
    const task = project.tasks.find(t => t.id === taskId)!;
    
    // Обновляем assignedTo, сохраняя список исполнителей если он уже существует
    let updatedAssignedTo: string | string[] = userId;
    
    if (task.assignedTo) {
      if (Array.isArray(task.assignedTo)) {
        updatedAssignedTo = [...task.assignedTo, userId];
      } else if (task.assignedTo !== userId) {
        updatedAssignedTo = [task.assignedTo, userId];
      }
    }
    
    const updatedTask: Task = {
      ...task,
      assignedTo: updatedAssignedTo,
      actualStartDate: task.actualStartDate || new Date().toISOString()
    };
    
    onTaskUpdate(projectId, updatedTask);
  };

  const handleAddComment = (projectId: string, taskId: string) => {
    if (!newComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Комментарий не может быть пустым",
        variant: "destructive"
      });
      return;
    }

    const project = projects.find(p => p.id === projectId)!;
    const task = project.tasks.find(t => t.id === taskId)!;
    
    const comments = task.comments || [];
    const updatedTask = {
      ...task,
      comments: [...comments, newComment]
    };
    
    onTaskUpdate(project.id, updatedTask);
    setNewComment("");
    setEditingTaskId(null);
    
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий был успешно добавлен к задаче",
    });
  };
  
  if (availableTasks.length === 0) {
    return <EmptyAvailableTasks />;
  }
  
  return (
    <div className="space-y-4">
      {availableTasks.map(({ project, task }) => (
        <AvailableTaskItem 
          key={task.id}
          project={project}
          task={task}
          editingTaskId={editingTaskId}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          onStartEditing={() => setEditingTaskId(task.id)}
          onCancelEditing={() => {
            setEditingTaskId(null);
            setNewComment("");
          }}
          onAddComment={() => handleAddComment(project.id, task.id)}
          onAssignTask={() => handleAssignTask(project.id, task.id)}
        />
      ))}
    </div>
  );
};

// Вспомогательная функция для сбора доступных задач
const collectAvailableTasks = (projects: Project[], userId: string) => {
  const availableTasks: {project: Project, task: Task}[] = [];
  
  projects.forEach(project => {
    project.tasks.forEach(task => {
      // Показываем задачи без исполнителей или задачи, которые можно взять нескольким исполнителям
      const isAssigned = Array.isArray(task.assignedTo)
        ? task.assignedTo.includes(userId)
        : task.assignedTo === userId;
        
      if (!task.assignedTo || !isAssigned) {
        availableTasks.push({
          project,
          task
        });
      }
    });
  });
  
  return availableTasks;
};

// Компонент для отображения сообщения, если нет доступных задач
const EmptyAvailableTasks: React.FC = () => {
  return (
    <div className="text-center py-4 text-slate-500">
      Нет доступных задач
    </div>
  );
};

// Компонент для отображения одной доступной задачи
interface AvailableTaskItemProps {
  project: Project;
  task: Task;
  editingTaskId: string | null;
  newComment: string;
  onNewCommentChange: (comment: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onAddComment: () => void;
  onAssignTask: () => void;
}

const AvailableTaskItem: React.FC<AvailableTaskItemProps> = ({
  project,
  task,
  editingTaskId,
  newComment,
  onNewCommentChange,
  onStartEditing,
  onCancelEditing,
  onAddComment,
  onAssignTask
}) => {
  const isEditing = editingTaskId === task.id;
  
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-slate-900">{task.name}</p>
          <p className="text-sm text-slate-500 mt-1">
            Проект: {project.name}
          </p>
          <p className="text-sm text-slate-700 mt-2">
            {task.description}
          </p>
          
          {/* Отображение количества исполнителей */}
          {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 && (
            <div className="mt-1 text-xs inline-flex items-center bg-purple-100 text-purple-800 rounded px-2 py-0.5">
              <Icon name="Users" className="h-3 w-3 mr-1" />
              {task.assignedTo.length > 1 
                ? `Выполняют ${task.assignedTo.length} сотрудников` 
                : "Выполняет 1 сотрудник"}
            </div>
          )}
          
          {/* Комментарии к задаче */}
          {task.comments && task.comments.length > 0 && (
            <TaskComments comments={task.comments} />
          )}

          {/* Форма добавления комментария */}
          {isEditing ? (
            <TaskCommentForm 
              comment={newComment}
              onCommentChange={onNewCommentChange}
              onSave={onAddComment}
              onCancel={onCancelEditing}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={onStartEditing}
            >
              <Icon name="MessageSquarePlus" className="h-3.5 w-3.5 mr-1" />
              Добавить комментарий
            </Button>
          )}
          
          {/* Метаданные задачи */}
          <TaskMetadata 
            price={task.price} 
            estimatedTime={task.estimatedTime} 
          />
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={onAssignTask}
        >
          Взять в работу
        </Button>
      </div>
    </div>
  );
};

// Компонент для отображения комментариев к задаче
interface TaskCommentsProps {
  comments: string[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments }) => {
  return (
    <div className="mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-200">
      <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
      <ul className="list-disc pl-4 space-y-1">
        {comments.map((comment, index) => (
          <li key={index} className="text-gray-600">{comment}</li>
        ))}
      </ul>
    </div>
  );
};

// Компонент для отображения метаданных задачи (цена, время)
interface TaskMetadataProps {
  price: number;
  estimatedTime: number;
}

const TaskMetadata: React.FC<TaskMetadataProps> = ({ price, estimatedTime }) => {
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
        Цена: {price} ₽
      </span>
      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
        Время: {estimatedTime} ч
      </span>
    </div>
  );
};

export default AvailableTasksSection;
