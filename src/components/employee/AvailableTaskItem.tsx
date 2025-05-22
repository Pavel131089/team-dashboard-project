
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Task } from "@/types/project";

interface AvailableTaskItemProps {
  task: Task & { projectName?: string };
  projectName: string;
  onTakeTask: () => void;
}

const AvailableTaskItem: React.FC<AvailableTaskItemProps> = ({ 
  task, 
  projectName, 
  onTakeTask 
}) => {
  // Форматирование даты
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "Не указано";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      return "Неверный формат";
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{task.name || "Без названия"}</h3>
            <p className="text-sm text-slate-600 line-clamp-2 mt-1">
              {task.description || "Нет описания"}
            </p>
          </div>
          <Badge variant="outline" className="ml-2">
            {projectName || "Проект"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Icon name="Calendar" className="h-3 w-3" />
            <span>Начало: {formatDate(task.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="CalendarClock" className="h-3 w-3" />
            <span>Дедлайн: {formatDate(task.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" className="h-3 w-3" />
            <span>Время: {task.estimatedTime || 0} ч.</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="DollarSign" className="h-3 w-3" />
            <span>Цена: {task.price?.toLocaleString() || 0} ₽</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={onTakeTask} 
          size="sm"
          className="w-full"
        >
          <Icon name="Check" className="h-4 w-4 mr-1" />
          Взять в работу
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvailableTaskItem;
