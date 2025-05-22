import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/project";
import Icon from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getProgressColorClass } from "@/utils/progressUtils";

interface TaskWithProject extends Task {
  projectId: string;
  projectName: string;
}

interface EmployeeTasksCardProps {
  tasks: TaskWithProject[];
  onUpdateProgress: (
    taskId: string,
    projectId: string,
    progress: number,
  ) => void;
  onAddComment: (taskId: string, projectId: string, comment: string) => void;
}

const EmployeeTasksCard: React.FC<EmployeeTasksCardProps> = ({
  tasks,
  onUpdateProgress,
  onAddComment,
}) => {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>("");

  // Убедимся, что tasks определен и является массивом
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Разделяем задачи на активные и завершенные
  const activeTasks = safeTasks.filter((task) => (task.progress || 0) < 100);
  const completedTasks = safeTasks.filter(
    (task) => (task.progress || 0) === 100,
  );

  // Обработчик отправки комментария
  const handleSubmitComment = (taskId: string, projectId: string) => {
    if (commentText.trim()) {
      onAddComment(taskId, projectId, commentText);
      setCommentText("");
    }
  };

  // Функция для отображения дат
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "Не указано";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU");
    } catch (error) {
      return "Неверный формат";
    }
  };

  // Группируем задачи по проектам для отображения дополнительной информации
  const groupTasksByProject = () => {
    const projectMap: Record<
      string,
      {
        projectId: string;
        projectName: string;
        tasks: TaskWithProject[];
      }
    > = {};

    safeTasks.forEach((task) => {
      if (!task.projectId) return;

      if (!projectMap[task.projectId]) {
        projectMap[task.projectId] = {
          projectId: task.projectId,
          projectName: task.projectName || "Без названия",
          tasks: [],
        };
      }

      projectMap[task.projectId].tasks.push(task);
    });

    return Object.values(projectMap);
  };

  const projectGroups = groupTasksByProject();

  // Компонент для отображения проекта
  const ProjectGroup = ({
    projectInfo,
  }: {
    projectInfo: {
      projectId: string;
      projectName: string;
      tasks: TaskWithProject[];
    };
  }) => {
    // Вычисляем прогресс проекта
    const projectProgress = Math.round(
      projectInfo.tasks.reduce((sum, task) => sum + (task.progress || 0), 0) /
        projectInfo.tasks.length,
    );

    return (
      <div className="mb-6 border rounded-md overflow-hidden">
        <div className="bg-gray-50 border-b p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center">
              <Icon name="Folder" className="h-4 w-4 mr-2 text-primary" />
              {projectInfo.projectName}
            </h3>
            <span className="text-sm">{projectProgress}% выполнено</span>
          </div>
          <Progress value={projectProgress} className="h-1" />
        </div>
        <div className="p-3">
          {projectInfo.tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

  // Компонент для отображения одной задачи
  const TaskItem = ({ task }: { task: TaskWithProject }) => {
    // Проверяем, что задача существует и имеет id
    if (!task || !task.id) {
      return null;
    }

    // Безопасно получаем progress
    const progress = typeof task.progress === "number" ? task.progress : 0;

    return (
      <AccordionItem
        value={task.id}
        className="border rounded-md mb-3 bg-white"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex flex-col items-start w-full text-left">
            <div className="flex justify-between w-full">
              <div className="font-medium">{task.name || "Без названия"}</div>
              <Badge variant="outline" className="ml-2">
                {task.projectName || "Проект"}
              </Badge>
            </div>
            <Progress value={progress} className="h-2 mt-2 w-full" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">
                {task.description || "Без описания"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" className="h-3 w-3" />
                  <span>Начало: {formatDate(task.startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="CalendarClock" className="h-3 w-3" />
                  <span>Дедлайн: {formatDate(task.endDate)}</span>
                </div>
                <div>Оценка времени: {task.estimatedTime || 0} ч.</div>
                <div>
                  Стоимость:{" "}
                  {typeof task.price === "number"
                    ? task.price.toLocaleString()
                    : 0}{" "}
                  ₽
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Прогресс выполнения</p>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm">{progress}%</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[0, 25, 50, 75, 100].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onUpdateProgress(task.id, task.projectId, value)
                    }
                    className={
                      progress === value
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    {value}%
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Комментарии</p>
              <div className="bg-slate-50 p-3 rounded-md mb-3 max-h-40 overflow-y-auto">
                {task.comments && task.comments.length > 0 ? (
                  <div className="space-y-2">
                    {task.comments.map((comment, index) => (
                      <div
                        key={comment?.id || index}
                        className="text-sm border-l-2 border-slate-300 pl-2"
                      >
                        <p className="text-xs text-slate-500">
                          {comment?.author || "Система"} •{" "}
                          {formatDate(comment?.date)}
                        </p>
                        <p>{comment?.text || ""}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Нет комментариев</p>
                )}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Добавить комментарий..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full h-20 resize-none"
                />
                <Button
                  onClick={() => handleSubmitComment(task.id, task.projectId)}
                  disabled={!commentText.trim()}
                  size="sm"
                  className="w-full"
                >
                  Отправить
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Мои задачи</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="projects" className="flex-1">
              По проектам{" "}
              <Badge className="ml-2 bg-primary">{projectGroups.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1">
              Активные{" "}
              <Badge className="ml-2 bg-primary">{activeTasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Завершенные{" "}
              <Badge className="ml-2 bg-green-600">
                {completedTasks.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Добавляем новую вкладку для группировки по проектам */}
          <TabsContent value="projects">
            {projectGroups.length === 0 ? (
              <div className="text-center py-8">
                <Icon
                  name="Briefcase"
                  className="mx-auto h-12 w-12 text-slate-300"
                />
                <p className="mt-2 text-slate-500">
                  У вас нет задач в проектах
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {projectGroups.map((projectInfo) => (
                  <ProjectGroup
                    key={projectInfo.projectId}
                    projectInfo={projectInfo}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8">
                <Icon
                  name="ClipboardList"
                  className="mx-auto h-12 w-12 text-slate-300"
                />
                <p className="mt-2 text-slate-500">У вас нет активных задач</p>
              </div>
            ) : (
              <Accordion
                type="single"
                collapsible
                value={activeTask || undefined}
                onValueChange={(value) => setActiveTask(value)}
              >
                {activeTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </Accordion>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8">
                <Icon
                  name="CheckCircle"
                  className="mx-auto h-12 w-12 text-slate-300"
                />
                <p className="mt-2 text-slate-500">
                  У вас нет завершенных задач
                </p>
              </div>
            ) : (
              <Accordion
                type="single"
                collapsible
                value={activeTask || undefined}
                onValueChange={(value) => setActiveTask(value)}
              >
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeTasksCard;
