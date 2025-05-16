
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskComments from "@/components/employee/TaskComments";
import TaskCommentForm from "@/components/employee/TaskCommentForm";
import Icon from "@/components/ui/icon";
import { Task } from "@/types/project";

interface EmployeeTaskCommentsProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

const EmployeeTaskComments: React.FC<EmployeeTaskCommentsProps> = ({
  task,
  onUpdateTask
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  
  // Проверяем, есть ли у задачи комментарии
  const hasComments = task.comments && task.comments.length > 0;
  
  // Добавить новый комментарий
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // Создаем новый комментарий с текущей датой
    const commentWithDate = `${new Date().toLocaleString('ru-RU')}: ${newComment}`;
    
    // Создаем обновленную задачу с новым комментарием
    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), commentWithDate]
    };
    
    // Обновляем задачу
    onUpdateTask(updatedTask);
    
    // Сбрасываем форму
    setNewComment("");
    setShowCommentForm(false);
  };
  
  return (
    <div className="mt-2 space-y-2">
      {/* Отображаем комментарии, если они есть */}
      {hasComments && (
        <TaskComments comments={task.comments || []} />
      )}
      
      {/* Отображаем форму добавления комментария или кнопку */}
      {showCommentForm ? (
        <TaskCommentForm
          comment={newComment}
          onCommentChange={setNewComment}
          onSave={handleAddComment}
          onCancel={() => setShowCommentForm(false)}
        />
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowCommentForm(true)}
          className="text-xs h-8"
        >
          <Icon name="MessageSquarePlus" className="mr-1 h-3.5 w-3.5" />
          {hasComments ? "Добавить комментарий" : "Написать комментарий"}
        </Button>
      )}
    </div>
  );
};

export default EmployeeTaskComments;
