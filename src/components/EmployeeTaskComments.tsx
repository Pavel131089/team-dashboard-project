
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Task } from "@/types/project";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface EmployeeTaskCommentsProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

const EmployeeTaskComments: React.FC<EmployeeTaskCommentsProps> = ({
  task,
  onUpdateTask,
}) => {
  const [newComment, setNewComment] = useState("");

  // Форматирование даты и времени для комментария
  const formatCommentDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy, HH:mm", { 
        locale: ru 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Добавление нового комментария
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const timestamp = new Date().toISOString();
    const commentWithTimestamp = `${timestamp}: ${newComment}`;

    const updatedComments = task.comments ? [...task.comments, commentWithTimestamp] : [commentWithTimestamp];
    onUpdateTask({
      ...task,
      comments: updatedComments,
    });

    setNewComment("");
  };

  // Парсинг комментария на дату и текст
  const parseComment = (comment: string) => {
    // Формат: "2023-05-16T12:34:56.789Z: текст комментария"
    const match = comment.match(/^([^:]+):\s*(.*)/);
    if (match && match.length >= 3) {
      try {
        const dateStr = match[1].trim();
        const text = match[2].trim();
        return {
          date: formatCommentDate(dateStr),
          text: text
        };
      } catch (e) {
        return { date: "", text: comment };
      }
    }
    return { date: "", text: comment };
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

      <div className="flex gap-2">
        <Textarea
          placeholder="Добавить комментарий..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] text-sm"
        />
      </div>
      <Button 
        size="sm" 
        onClick={handleAddComment} 
        disabled={!newComment.trim()}
        className="mt-2 ml-auto"
      >
        <Icon name="Send" className="h-4 w-4 mr-1" />
        Добавить комментарий
      </Button>
    </div>
  );
};

export default EmployeeTaskComments;
