interface TaskCommentsProps {
  comments?: string[];
}

/**
 * Компонент для отображения комментариев к задаче
 */
const TaskComments = ({ comments }: TaskCommentsProps) => {
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
      <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
      <ul className="list-disc pl-4 space-y-1">
        {comments.map((comment, index) => (
          <li key={index} className="text-gray-600">{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskComments;