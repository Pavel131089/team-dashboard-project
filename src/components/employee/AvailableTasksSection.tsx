
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Task, Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import EmptyAvailableTasks from "@/components/employee/EmptyAvailableTasks";

interface AvailableTasksSectionProps {
  tasks: any[];
  onTakeTask: (taskId: string, projectId: string) => void;
  projects?: Project[];
}

// Безопасное форматирование даты
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "Не указано";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Не указано";
    return date.toLocaleDateString("ru-RU");
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Не указано";
  }
};

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = (props) => {
  // Защитное копирование props
  const { 
    onTakeTask = () => {}, 
    projects = [] 
  } = props;
  
  // Безопасное получение и обработка задач
  const tasks = React.useMemo(() => {
    // Проверяем, что props.tasks существует и является массивом
    if (!props.tasks || !Array.isArray(props.tasks)) {
      console.warn("tasks не является массивом:", props.tasks);
      return [];
    }
    
    // Фильтруем и нормализуем задачи
    return props.tasks
      .filter(item => item && (item.task || item))
      .map((item, index) => {
        // Пытаемся извлечь task и project из разных возможных структур
        let task, project;
        
        // Вариант 1: { task, project } структура
        if (item.task && typeof item.task === 'object') {
          task = item.task;
          project = item.project;
        } 
        // Вариант 2: task напрямую
        else if (typeof item === 'object') {
          task = item;
          // Если task имеет projectId, пробуем найти проект
          if (task.projectId && Array.isArray(projects)) {
            project = projects.find(p => p.id === task.projectId);
          }
        }
        
        // Проверяем что task получен
        if (!task) {
          console.warn("Некорректная структура задачи:", item);
          return null;
        }
        
        // Генерируем id, если отсутствует
        const id = task.id || `task-${index}`;
        
        return {
          task: { ...task, id },
          project: project || {},
        };
      })
      .filter(Boolean); // Удаляем null элементы
  }, [props.tasks, projects]);
  
  // Если нет задач, показываем пустое состояние
  if (tasks.length === 0) {
    return <EmptyAvailableTasks />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon name="Briefcase" className="text-primary h-5 w-5" />
          <CardTitle>Доступные задачи</CardTitle>
        </div>
        <CardDescription>Задачи, которые вы можете взять в работу</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map(({ task, project }, index) => {
          // Безопасно получаем даты с проверкой
          const startDate = task?.startDate || project?.startDate;
          const endDate = task?.endDate || project?.endDate;
          
          // Безопасно получаем ID
          const taskId = task?.id || `task-${index}`;
          const projectId = project?.id || "";
          
          return (
            <div key={taskId} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base">{task?.name || "Без названия"}</h3>
                  {task?.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {project?.name || "Проект"}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Icon name="Calendar" className="h-3 w-3" />
                  <span>Начало: {formatDate(startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="CalendarClock" className="h-3 w-3" />
                  <span>Окончание: {formatDate(endDate)}</span>
                </div>
                {task?.estimatedTime ? (
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" className="h-3 w-3" />
                    <span>Время: {task.estimatedTime} ч.</span>
                  </div>
                ) : null}
                {task?.price ? (
                  <div className="flex items-center gap-1">
                    <Icon name="CircleDollarSign" className="h-3 w-3" />
                    <span>Цена: {task.price} ₽</span>
                  </div>
                ) : null}
              </div>
              
              <Button 
                onClick={() => onTakeTask(taskId, projectId)}
                className="w-full mt-3"
                size="sm"
              >
                <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                Взять в работу
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AvailableTasksSection;
