
import React from "react";
import { Project, Task } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AvailableTasksCardProps {
  projects: Project[];
  userId: string;
  onTaskUpdate: (projectId: string, task: Task) => void;
}

const AvailableTasksCard: React.FC<AvailableTasksCardProps> = ({ projects, userId, onTaskUpdate }) => {
  // Получаем все задачи из проектов, которые не назначены текущему пользователю и имеют статус "Свободна"
  const availableTasks = projects.flatMap(project =>
    project.tasks
      .filter(task => 
        (!task.assignedTo || !task.assignedToNames?.includes(userId)) && 
        task.progress === 0
      )
      .map(task => ({ project, task }))
  );

  // Функция для взятия задачи в работу
  const handleTakeTask = (projectId: string, task: Task) => {
    // Находим проект
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Находим пользователя (в реальном приложении здесь было бы обращение к API)
    const userName = userId; // Упрощенно, просто используем userId как имя
    
    // Обновляем задачу
    const updatedTask: Task = {
      ...task,
      assignedTo: userId,
      assignedToNames: [...(task.assignedToNames || []), userId],
      comments: [...(task.comments || []), {
        id: Date.now().toString(),
        text: "Я беру эту задачу в работу",
        userId,
        userName,
        date: new Date().toISOString(),
      }],
    };
    
    // Вызываем функцию обновления
    onTaskUpdate(projectId, updatedTask);
    
    // Показываем уведомление
    toast.success(`Вы взяли задачу "${task.name}" в работу`);
  };

  // Если нет доступных задач, показываем пустое состояние
  if (availableTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Доступные проекты</CardTitle>
          <CardDescription>Проекты, в которых вы можете принять участие</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <Icon
              name="Briefcase"
              className="h-16 w-16 text-slate-200 mb-4"
            />
            <p className="text-slate-500 mb-1">Нет доступных проектов</p>
            <p className="text-sm text-slate-400">
              Здесь будут отображаться проекты, требующие вашего участия
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Доступные задачи</CardTitle>
        <CardDescription>Задачи, которые вы можете взять в работу</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Задача</TableHead>
              <TableHead>Проект</TableHead>
              <TableHead>Сроки</TableHead>
              <TableHead>Оценка времени</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableTasks.map(({ project, task }) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{task.name}</span>
                    {task.description && (
                      <span className="text-xs text-slate-500 truncate max-w-xs">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{project.name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{task.startDate ? formatDate(task.startDate) : "—"}</div>
                    <div>{task.endDate ? formatDate(task.endDate) : "—"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {task.estimatedTime ? `${task.estimatedTime} ч.` : "Не указано"}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm"
                    onClick={() => handleTakeTask(project.id, task)}
                  >
                    <Icon name="CheckCircle" className="mr-1 h-4 w-4" />
                    Взять в работу
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AvailableTasksCard;
