import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface TaskCommentSectionProps {
  comments?: any[]; // Изменил тип на any[] для большей гибкости
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
  onStartEdit,
}) => {
  // Проверяем, что comments существует и является массивом
  const hasComments = Array.isArray(comments) && comments.length > 0;

  // Функция для безопасного отображения комментария
  const renderComment = (comment: any, index: number) => {
    try {
      // Проверяем тип комментария
      if (typeof comment === "string") {
        // Если комментарий - строка, просто отображаем её
        return (
          <li key={index} className="text-gray-600">
            {comment}
          </li>
        );
      } else if (comment && typeof comment === "object") {
        // Если комментарий - объект, проверяем наличие текста
        const commentText =
          comment.text ||
          (typeof comment.toString === "function"
            ? comment.toString()
            : "Комментарий");

        // Проверяем наличие даты или автора
        const hasMetadata = comment.date || comment.author;

        return (
          <li key={index} className="text-gray-600">
            {hasMetadata && (
              <div className="text-xs text-gray-500 mb-1">
                {comment.author && <span>{comment.author}</span>}
                {comment.author && comment.date && <span> • </span>}
                {comment.date && (
                  <span>
                    {typeof comment.date === "string"
                      ? new Date(comment.date).toLocaleString("ru-RU", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Некорректная дата"}
                  </span>
                )}
              </div>
            )}
            <div>{commentText}</div>
          </li>
        );
      } else {
        // Если комментарий невалидный, отображаем заглушку
        return (
          <li key={index} className="text-gray-600">
            <span className="text-gray-400">Недоступный комментарий</span>
          </li>
        );
      }
    } catch (error) {
      console.error("Ошибка при рендеринге комментария:", error);
      return (
        <li key={index} className="text-gray-600">
          <span className="text-gray-400">Ошибка отображения комментария</span>
        </li>
      );
    }
  };

  return (
    <>
      {/* Отображение существующих комментариев */}
      {hasComments ? (
        <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
          <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
          <ul className="list-disc pl-4 space-y-1">
            {comments.map((comment, index) => renderComment(comment, index))}
          </ul>
        </div>
      ) : null}

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
            <Button size="sm" onClick={onSaveComment}>
              Сохранить
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
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
