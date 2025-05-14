
import React from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import TaskComments from "./TaskComments";
import TaskCommentForm from "./TaskCommentForm";
import TaskMetadata from "./TaskMetadata";

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
          
          {/* Отображение стоимости задачи */}
          {task.price > 0 && (
            <div className="mt-1 text-xs font-medium text-green-700 bg-green-50 inline-flex items-center rounded px-2 py-0.5 mr-1">
              <Icon name="CircleDollarSign" className="h-3 w-3 mr-1" />
              Стоимость: {task.price} ₽
            </div>
          )}
          
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

export default AvailableTaskItem;
