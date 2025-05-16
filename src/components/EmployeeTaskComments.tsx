
import React, { useState } from "react";
import { Task } from "@/types/project";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface EmployeeTaskCommentsProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

const EmployeeTaskComments: React.FC<EmployeeTaskCommentsProps> = ({
  task,
  onUpdateTask,
}) => {
  const [newComment, setNewComment] = useState("");

  // Добавляем новый комментарий
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // Форматируем комментарий с датой и временем
    const now = new Date();
    const formattedDate = now.toLocaleDateString("ru-RU");
    const formattedTime = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    
    const formattedComment = `${formattedDate}, ${formattedTime}: ${newComment}`;
    
    // Создаем обновленный массив комментариев
    const updatedComments = task.comments 
      ? [...task.comments, formattedComment] 
      : [formattedComment];
    
    // Обновляем задачу
    onUpdateTask({
      ...task,
      comments: updatedComments,
    });
    
    // Очищаем поле ввода
    setNewComment("");
  };

  return (
    <div className="space-y-3">
      {/* Отображение существующих комментариев */}
      {task.comments && task.comments.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">Комментарии:</h4>
          <ul className="space-y-1 text-sm">
            {task.comments.map((comment, index) => (
              <li key={index} className="pl-2 border-l-2 border-gray-200">
                {comment}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Форма добавления комментария */}
      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="Добавить комментарий..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[60px]"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment} 
            size="sm" 
            disabled={!newComment.trim()}
          >
            <Icon name="MessageSquarePlus" className="h-4 w-4 mr-1" />
            Добавить комментарий
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskComments;
