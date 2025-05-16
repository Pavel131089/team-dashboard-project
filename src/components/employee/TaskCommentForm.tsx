import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

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
  onCancel,
}) => {
  return (
    <div className="mt-2 space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Введите комментарий к задаче..."
        className="text-xs"
        rows={2}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} className="text-xs">
          <Icon name="Check" className="mr-1 h-3.5 w-3.5" />
          Сохранить
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="text-xs"
        >
          <Icon name="X" className="mr-1 h-3.5 w-3.5" />
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default TaskCommentForm;
