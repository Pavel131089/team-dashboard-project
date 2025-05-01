import { Badge } from "@/components/ui/badge";

interface TaskStatusBadgeProps {
  isCompleted: boolean;
}

/**
 * Компонент для отображения статуса задачи
 */
const TaskStatusBadge = ({ isCompleted }: TaskStatusBadgeProps) => {
  if (isCompleted) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
        Завершено
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
      В работе
    </Badge>
  );
};

export default TaskStatusBadge;