
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TaskCommentFormProps {
  comment: string;
  onCommentChange: (comment: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TaskCommentForm: React.FC<TaskCommentFormProps> = ({
  comment,
  onCommentChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="mt-2 space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Введите комментарий..."
        className="text-xs"
        rows={2}
      />
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={onSave}
        >
          Сохранить
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default TaskCommentForm;
