
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface TaskCommentSectionProps {
  comments?: string[];
  isEditing: boolean;
  newComment: string;
  onNewCommentChange: (comment: string) => void;
  onSaveComment: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
}

const TaskCommentSection: React.FC<TaskCommentSectionProps> = ({
  comments,
  isEditing,
  newComment,
  onNewCommentChange,
  onSaveComment,
  onCancelEdit,
  onStartEdit
}) => {
  return (
    <>
      {/* Отображение существующих комментариев */}
      {comments && comments.length > 0 && (
        <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
          <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
          <ul className="list-disc pl-4 space-y-1">
            {comments.map((comment, index) => (
              <li key={index} className="text-gray-600">{comment}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Форма добавления комментария */}
      {isEditing ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            placeholder="Введите комментарий..."
            className="text-xs"
            rows={2}
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={onSaveComment}
            >
              Сохранить
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onCancelEdit}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-7 text-xs"
          onClick={onStartEdit}
        >
          <Icon name="MessageSquarePlus" className="h-3.5 w-3.5 mr-1" />
          Добавить комментарий
        </Button>
      )}
    </>
  );
};

export default TaskCommentSection;
