
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Task } from "@/types/project";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface AvailableTaskItemProps {
  task: Task & { projectId?: string; projectName?: string };
  projectName: string;
  onTakeTask: () => void;
}

const AvailableTaskItem: React.FC<AvailableTaskItemProps> = ({
  task,
  projectName,
  onTakeTask,
}) => {
  // Форматирование даты
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy", { locale: ru });
    } catch (e) {
      return "Дата не указана";
    }
  };

  // Получаем сроки
  const startDate = task.startDate ? formatDate(task.startDate) : "Не указана";
  const endDate = task.endDate ? formatDate(task.endDate) : "Не указана";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="border-b p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{task.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Проект: {projectName}
              </p>
            </div>
            <Button
              onClick={onTakeTask}
              className="ml-4 mt-1"
              size="sm"
            >
              <Icon name="CheckCircle" className="mr-1 h-4 w-4" />
              Взять в работу
            </Button>
          </div>
          <p className="text-sm mt-1 line-clamp-2">{task.description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 text-sm">
          <div>
            <p className="text-muted-foreground">Сроки</p>
            <p>
              {startDate} — {endDate}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Стоимость</p>
            <p>{task.price ? `${task.price.toLocaleString()} ₽` : "Не указана"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Оценка времени</p>
            <p>{task.estimatedTime ? `${task.estimatedTime} ч.` : "Не указана"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableTaskItem;
