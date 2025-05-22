
import React, { useState } from "react";
import { Project, Task } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { formatDate } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface EmployeeTasksCardProps {
  userTasks: { project: Project; task: Task }[];
  userId: string;
  onTaskUpdate: (projectId: string, task: Task) => void;
}

const EmployeeTasksCard: React.FC<EmployeeTasksCardProps> = ({ userTasks, userId, onTaskUpdate }) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Функция для обновления прогресса задачи
  const handleProgressUpdate = (projectId: string, task: Task, newProgress: number) => {
    const updatedTask: Task = {
      ...task,
      progress: newProgress,
    };
    
    onTaskUpdate(projectId, updatedTask);
    toast.success(`Прогресс задачи "${task.name}" обновлен до ${newProgress}%`);
  };

  // Функция для добавления комментария к задаче
  const handleAddComment = (projectId: string, task: Task, comment: string) => {
    if (!comment.trim()) return;
    
    const now = new Date();
    const updatedTask: Task = {
      ...task,
      comments: [...(task.comments || []), {
        id: Date.now().toString(),
        text: comment,
        userId,
        userName: "Вы",
        date: now.toISOString(),
      }],
    };
    
    onTaskUpdate(projectId, updatedTask);
    toast.success("Комментарий добавлен");
  };

  // Если нет задач, показываем пустое состояние
  if (userTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Мои задачи</CardTitle>
          <CardDescription>Список назначенных вам задач</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <Icon
              name="ClipboardList"
              className="h-16 w-16 text-slate-200 mb-4"
            />
            <p className="text-slate-500 mb-1">У вас пока нет назначенных задач</p>
            <p className="text-sm text-slate-400">
              Задачи появятся здесь, когда руководитель назначит их вам
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои задачи</CardTitle>
        <CardDescription>Список назначенных вам задач</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          value={expandedTask}
          onValueChange={setExpandedTask}
        >
          {userTasks.map(({ project, task }) => (
            <AccordionItem key={task.id} value={task.id}>
              <AccordionTrigger className="hover:bg-slate-50 px-3 rounded-md">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center">
                    <span className="font-medium">{task.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {project.name}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={task.progress} className="w-24 h-2" />
                    <span className="text-xs text-slate-500">{task.progress}%</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-4">
                  {/* Описание задачи */}
                  {task.description && (
                    <div className="bg-slate-50 p-3 rounded-md">
                      <p className="text-sm">{task.description}</p>
                    </div>
                  )}
                  
                  {/* Информация о задаче */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 block">Сроки:</span>
                      <span className="font-medium">
                        {task.startDate ? formatDate(task.startDate) : "Не указано"} - {task.endDate ? formatDate(task.endDate) : "Не указано"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Оценка времени:</span>
                      <span className="font-medium">{task.estimatedTime || 0} ч.</span>
                    </div>
                  </div>
                  
                  {/* Управление прогрессом */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Прогресс выполнения:</span>
                      <span className="text-sm">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2 w-full" />
                    <div className="flex justify-between mt-2">
                      {[0, 25, 50, 75, 100].map((progress) => (
                        <Button
                          key={progress}
                          variant={task.progress === progress ? "default" : "outline"}
                          size="sm"
                          className="text-xs py-1 px-2 h-auto"
                          onClick={() => handleProgressUpdate(project.id, task, progress)}
                        >
                          {progress}%
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Комментарии */}
                  <div className="space-y-2 border-t pt-3 mt-3">
                    <h4 className="text-sm font-medium">Комментарии:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {task.comments && task.comments.length > 0 ? (
                        task.comments.map((comment) => (
                          <div key={comment.id} className="bg-slate-50 p-2 rounded-md">
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>{comment.userName}</span>
                              <span>{formatDate(comment.date)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Нет комментариев</p>
                      )}
                    </div>
                    
                    {/* Форма добавления комментария */}
                    <div className="mt-2 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Добавить комментарий..."
                        className="flex-1 text-sm py-1 px-2 border rounded-md"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(project.id, task, e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleAddComment(project.id, task, input.value);
                          input.value = "";
                        }}
                      >
                        <Icon name="Send" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EmployeeTasksCard;
