import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task, Project } from "@/types/project";
import Icon from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  projects?: Project[]; // Получаем проекты через пропсы
}

const EmployeeTasksCard: React.FC<EmployeeTasksCardProps> = ({
  tasks,
  onUpdateProgress,
  onAddComment,
  projects = [], // Значение по умолчанию - пустой массив
}) => {
  const [commentText, setCommentText] = useState<string>("");
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {},
  );

  // Используем useEffect для логирования данных при монтировании компонента
  useEffect(() => {
    console.log("EmployeeTasksCard получил tasks:", tasks);
    console.log("EmployeeTasksCard получил projects:", projects);
  }, [tasks, projects]);

  // Создаем тестовые данные для проверки отображения
  const testTasks: TaskWithProject[] = [
    {
      id: "test-task-1",
      name: "Тестовая задача в работе",
      description: "Описание тестовой задачи в работе",
      price: 8000,
      estimatedTime: 10,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: "employee-1",
      assignedToNames: ["Иван Иванов"],
      progress: 30,
      projectId: "test-project-1",
      projectName: "Тестовый проект 1",
    },
    {
      id: "test-task-2",
      name: "Завершенная тестовая задача",
      description: "Описание завершенной тестовой задачи",
      price: 12000,
      estimatedTime: 20,
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      actualStartDate: new Date(
        Date.now() - 19 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      actualEndDate: new Date(
        Date.now() - 6 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      assignedTo: "employee-1",
      assignedToNames: ["Иван Иванов"],
      progress: 100,
      projectId: "test-project-2",
      projectName: "Тестовый проект 2",
    },
  ];

  // Используем тестовые данные вместо реальных для отладки
  // const safeTasks = Array.isArray(tasks) && tasks.length > 0 ? tasks : testTasks;
  const safeTasks = testTasks; // Принудительно используем тестовые данные

  // Разделяем задачи на активные и завершенные
  const activeTasks = safeTasks.filter((task) => (task.progress || 0) < 100);
  const completedTasks = safeTasks.filter(
    (task) => (task.progress || 0) === 100,
  );

  // Функция для тоггла раскрытия/закрытия задачи
  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

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
      if (isNaN(date.getTime())) return "Неверный формат";
      return date.toLocaleDateString("ru-RU");
    } catch (error) {
      return "Неверный формат";
    }
  };

  // Группируем задачи по проектам для отображения дополнительной информации
  const projectGroups = useMemo(() => {
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
  }, [safeTasks]);

  // ... keep existing code
  // Компонент для отображения проекта с задачами
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
        Math.max(projectInfo.tasks.length, 1),
    );

    // Находим полную информацию о проекте - проверяем все возможные источники данных
    const fullProject = useMemo(() => {
      // Проверяем, доступны ли данные в task.fullProject (если передано из родительского компонента)
      const taskWithFullProject = projectInfo.tasks.find((t) => t.fullProject);
      if (taskWithFullProject?.fullProject) {
        return taskWithFullProject.fullProject;
      }

      // Пробуем найти проект по ID в массиве projects
      if (Array.isArray(projects)) {
        const projectFromList = projects.find(
          (p) => p.id === projectInfo.projectId,
        );
        if (projectFromList) {
          return projectFromList;
        }
      }

      // Если ни один способ не сработал, ищем даты напрямую в задачах
      const firstTask = projectInfo.tasks[0];
      if (firstTask) {
        // Если в задаче есть ссылки на даты проекта, используем их
        if (firstTask.projectStartDate || firstTask.projectEndDate) {
          return {
            id: projectInfo.projectId,
            name: projectInfo.projectName,
            startDate: firstTask.projectStartDate,
            endDate: firstTask.projectEndDate,
            description: "",
            tasks: [],
            createdAt: "",
            createdBy: "",
          };
        }
      }

      return null;
    }, [projectInfo.projectId, projectInfo.tasks]);

    // Получаем даты проекта напрямую из задачи, если они есть
    const projectStartDate =
      fullProject?.startDate || projectInfo.tasks[0]?.projectStartDate;
    const projectEndDate =
      fullProject?.endDate || projectInfo.tasks[0]?.projectEndDate;

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

          {/* Даты проекта - проверяем все возможные источники данных */}
          <div className="flex flex-wrap gap-x-4 text-xs mb-3">
            <div className="flex items-center gap-1">
              <span className="font-medium">Начало:</span>
              <span>
                {projectStartDate ? formatDate(projectStartDate) : "Не указано"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Окончание:</span>
              <span>
                {projectEndDate ? formatDate(projectEndDate) : "Не указано"}
              </span>
            </div>
          </div>

          <Progress
            value={projectProgress}
            className="h-1"
            indicatorClassName={getProgressColorClass(projectProgress)}
          />
        </div>
        <div className="p-3">
          {projectInfo.tasks.map((task) => (
            <TaskItem
              key={
                task.id || `task-${Math.random().toString(36).substring(2, 11)}`
              }
              task={task}
            />
          ))}
        </div>
      </div>
    );
  };
  // ... keep existing code

  // Компонент для отображения задачи
  const TaskItem = ({ task }: { task: TaskWithProject }) => {
    // Получаем данные проекта (либо из fullProject, либо из других полей)
    const projectData = task.fullProject || {
      id: task.projectId,
      name: task.projectName || "Без названия",
      startDate: task.projectStartDate,
      endDate: task.projectEndDate,
    };

    // Отладка данных задачи и проекта
    console.log(`TaskItem in EmployeeTasksCard (${task.id}):`, {
      taskStartDate: task.startDate,
      taskEndDate: task.endDate,
      projectStartDate: projectData.startDate,
      projectEndDate: projectData.endDate,
    });

    // Приоритет: сначала даты задачи, затем проекта
    const startDate = task.startDate || projectData.startDate;
    const endDate = task.endDate || projectData.endDate;

    // ... keep existing code

    // Генерируем уникальный идентификатор для задачи, если его нет
    const taskId =
      task.id || `task-${Math.random().toString(36).substring(2, 11)}`;
    const isExpanded = expandedTasks[taskId] || false;

    // Безопасно получаем progress
    const progress = typeof task.progress === "number" ? task.progress : 0;

    return (
      <div className="border rounded-md mb-3 bg-white">
        {/* Заголовок задачи (всегда видимый) */}
        <div
          className="px-4 py-3 cursor-pointer flex flex-col"
          onClick={() => toggleTaskExpanded(taskId)}
        >
          <div className="flex justify-between w-full">
            <div className="font-medium">{task.name || "Без названия"}</div>
            <Badge variant="outline" className="ml-2">
              {task.projectName || "Проект"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 w-full mt-2">
            <Progress
              value={progress}
              className="h-2 w-full"
              indicatorClassName={getProgressColorClass(progress)}
            />
            <span className="text-xs whitespace-nowrap">{progress}%</span>
            <Icon
              name={isExpanded ? "ChevronUp" : "ChevronDown"}
              className="h-4 w-4 ml-1"
            />
          </div>
        </div>

        {/* Развернутая информация о задаче */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t">
            <div className="space-y-4 pt-3">
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  {task.description || "Без описания"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" className="h-3 w-3" />
                    <span>Начало: {formatDate(startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="CalendarClock" className="h-3 w-3" />
                    <span>Дедлайн: {formatDate(endDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" className="h-3 w-3" />
                    <span>Время: {task.estimatedTime || 0} ч.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="CircleDollarSign" className="h-3 w-3" />
                    <span>
                      Цена:{" "}
                      {typeof task.price === "number"
                        ? task.price.toLocaleString()
                        : 0}{" "}
                      ₽
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Прогресс выполнения</p>
                <div className="flex flex-wrap gap-2">
                  {[0, 25, 50, 75, 100].map((value) => (
                    <Button
                      key={value}
                      variant={progress === value ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateProgress(taskId, task.projectId, value);
                      }}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Комментарии</p>
                <div className="bg-slate-50 p-3 rounded-md mb-3 max-h-40 overflow-y-auto">
                  {Array.isArray(task.comments) && task.comments.length > 0 ? (
                    <div className="space-y-2">
                      {task.comments.map((comment, index) => (
                        <div
                          key={index}
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
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full h-20 resize-none"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmitComment(taskId, task.projectId);
                    }}
                    disabled={!commentText.trim()}
                    size="sm"
                    className="w-full"
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Отображение списка задач
  const renderTaskList = (taskList: TaskWithProject[]) => {
    if (taskList.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon
            name="ClipboardList"
            className="mx-auto h-12 w-12 text-slate-300"
          />
          <p className="mt-2 text-slate-500">Нет задач</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {taskList.map((task) => (
          <TaskItem
            key={
              task.id || `task-${Math.random().toString(36).substring(2, 11)}`
            }
            task={task}
          />
        ))}
      </div>
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
                    key={
                      projectInfo.projectId ||
                      `project-${Math.random().toString(36).substring(2, 11)}`
                    }
                    projectInfo={projectInfo}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {renderTaskList(activeTasks)}
          </TabsContent>

          <TabsContent value="completed">
            {renderTaskList(completedTasks)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeTasksCard;
