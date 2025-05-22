
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface CommentInputFormProps {
  initialValue?: string;
  onSubmit: (comment: string) => void;
}

/**
 * Изолированный компонент для ввода комментариев
 */
const CommentInputForm: React.FC<CommentInputFormProps> = ({
  initialValue = "",
  onSubmit,
}) => {
  // Локальное состояние для текста комментария
  const [comment, setComment] = useState(initialValue);
  // Ссылка на элемент текстового поля
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Обработчик изменения текста
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // Обработчик отправки
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };
  
  // Предотвращаем всплытие событий клика
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onClick={handleContainerClick}
      className="space-y-2"
    >
      <Textarea
        ref={textareaRef}
        placeholder="Добавить комментарий..."
        value={comment}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        className="w-full min-h-[80px] resize-none"
        autoComplete="off"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!comment.trim()}
        className="w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Icon name="Send" className="h-4 w-4 mr-1" />
        Отправить
      </Button>
    </form>
  );
};

export default CommentInputForm;
