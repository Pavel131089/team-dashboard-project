import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import ProjectInfoBadge from "@/components/employee/ProjectInfoBadge";
import EmployeeTaskComments from "@/components/EmployeeTaskComments";
import { Task } from "@/types/project";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface EmployeeTaskListProps {
  tasks: { project: any; task: Task }[];
  userId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const EmployeeTaskList: React.FC<EmployeeTaskListProps> = ({
  tasks,
  userId,
  onTaskUpdate,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Форматирование даты
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: ru });
    } catch (e) {
      return dateStr;
    }
  };

  // Обновление прогресса задачи
  const handleProgressChange = (
    projectId: string,
    task: Task,
    newProgress: number,
  ) => {
    const updatedTask = { ...task, progress: newProgress };
    onTaskUpdate(projectId, updatedTask);
  };

  // Обработчик для тоггла развернутой задачи
  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Получение класса цвета для прогресс-бара
  const getProgressColorClass = (percent: number): string => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Проверка, есть ли у задачи комментарии
  const hasComments = (task: Task): boolean => {
    return Boolean(task.comments && task.comments.length > 0);
  };

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Icon name="ClipboardList" className="mx-auto h-10 w-10 opacity-20" />
        <p className="mt-2">У вас пока нет назначенных задач</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Задача</TableHead>
            <TableHead className="w-[130px]">Проект</TableHead>
            <TableHead className="w-[130px]">Дата начала</TableHead>
            <TableHead className="w-[130px]">Дата окончания</TableHead>
            <TableHead className="w-[200px]">Прогресс</TableHead>
            <TableHead className="w-[80px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(({ project, task }) => (
            <React.Fragment key={task.id}>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1">
                    {task.name}
                    {hasComments(task) && (
                      <Badge variant="outline" className="ml-1 px-1">
                        <Icon name="MessageSquare" className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <ProjectInfoBadge project={project} />
                </TableCell>
                <TableCell>{formatDate(task.startDate)}</TableCell>
                <TableCell>{formatDate(task.endDate)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{task.progress}%</span>
                    </div>
                    <div className="flex">
                      <Slider
                        value={[task.progress || 0]}
                        min={0}
                        max={100}
                        step={5}
                        className="mr-2 mb-2"
                        onValueChange={(values) =>
                          handleProgressChange(project.id, task, values[0])
                        }
                      />
                    </div>
                    <Progress
                      value={task.progress || 0}
                      className="h-2"
                      indicatorClassName={getProgressColorClass(
                        task.progress || 0,
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTaskExpanded(task.id)}
                  >
                    <Icon
                      name={
                        expandedTaskId === task.id ? "ChevronUp" : "ChevronDown"
                      }
                      className="h-4 w-4"
                    />
                  </Button>
                </TableCell>
              </TableRow>

              {/* Развернутая информация о задаче */}
              {expandedTaskId === task.id && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-muted/30 px-4 py-3">
                    <div className="space-y-2">
                      {/* Дополнительная информация о задаче */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        {task.price && (
                          <div className="flex items-center gap-1">
                            <Icon
                              name="CircleDollarSign"
                              className="h-4 w-4 text-muted-foreground"
                            />
                            <span className="text-muted-foreground">Цена:</span>
                            <span>{task.price} 20</span>
                          </div>
                        )}
                        {task.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <Icon
                              name="Clock"
                              className="h-4 w-4 text-muted-foreground"
                            />
                            <span className="text-muted-foreground">
                              Оценка времени:
                            </span>
                            <span>{task.estimatedTime} 47</span>
                          </div>
                        )}
                      </div>

                      {/* Компонент работы с комментариями */}
                      <EmployeeTaskComments
                        task={task}
                        onUpdateTask={(updatedTask) =>
                          onTaskUpdate(project.id, updatedTask)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTaskList;
