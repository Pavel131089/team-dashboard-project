import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Task } from "@/types/project";
import { parseComment } from "@/utils/dateUtils";
import { addCommentToTask } from "@/utils/taskUtils";

interface TaskCommentsProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ task, onUpdateTask }) => {
  const [newComment, setNewComment] = useState("");

  // Обработчик изменения текста комментария
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  // Добавление нового комментария
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // Используем функцию-помощник для добавления комментария к конкретной задаче
    const updatedTask = addCommentToTask(task, newComment);

    // Обновляем задачу через пропс-функцию
    onUpdateTask(updatedTask);

    // Очищаем поле ввода
    setNewComment("");
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Icon name="MessageSquare" className="h-4 w-4" />
        Комментарии
      </h4>

      {task.comments && task.comments.length > 0 ? (
        <ul className="space-y-2 mb-3 text-sm">
          {task.comments.map((comment, index) => {
            const { date, text } = parseComment(comment);
            return (
              <li key={index} className="border-l-2 border-muted pl-3 py-1">
                {date && (
                  <span className="text-xs text-muted-foreground block mb-1">
                    {date}
                  </span>
                )}
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground mb-3">
          Комментариев пока нет
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Добавить комментарий..."
          value={newComment}
          onChange={handleCommentChange}
          className="min-h-[80px] text-sm resize-none"
        />
        <Button
          size="sm"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="mt-1 ml-auto"
        >
          <Icon name="Send" className="h-4 w-4 mr-1" />
          Добавить комментарий
        </Button>
      </div>
    </div>
  );
};

export default TaskComments;
