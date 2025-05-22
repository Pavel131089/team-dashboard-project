
import React from "react";
import { Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AvailableTaskItemProps {
  task: Task;
  projectName: string;
  onTakeTask: () => void;
}

const AvailableTaskItem: React.FC<AvailableTaskItemProps> = ({
  task,
  projectName,
  onTakeTask,
}) => {
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  // Функция для форматирования стоимости
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base">{task.name}</h3>
            <Badge variant="outline" className="ml-2">{projectName}</Badge>
          </div>
          
          <p className="text-sm text-slate-600">{task.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div className="flex items-center">
              <Icon name="Calendar" className="h-3 w-3 mr-1" />
              <span>Сроки: {formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
            </div>
            <div className="flex items-center">
              <Icon name="Clock" className="h-3 w-3 mr-1" />
              <span>Оценка времени: {task.estimatedTime} ч.</span>
            </div>
            <div className="flex items-center">
              <Icon name="DollarSign" className="h-3 w-3 mr-1" />
              <span>Стоимость: {formatPrice(task.price)}</span>
            </div>
          </div>
          
          <Button 
            onClick={onTakeTask} 
            className="w-full mt-2"
            size="sm"
          >
            <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
            Взять в работу
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableTaskItem;
