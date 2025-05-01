import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task, User } from "@/types/project";
import EmployeeTaskList from "@/components/EmployeeTaskList";
import { toast } from "@/components/ui/use-toast";

const Employee = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userTasks, setUserTasks] = useState<{project: Project; task: Task}[]>([]);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    const projectsFromStorage = localStorage.getItem('projects');
    
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
        setUserName(parsedUser.username || "");
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    } else {
      navigate("/login");
      return;
    }
    
    if (projectsFromStorage) {
      try {
        const parsedProjects: Project[] = JSON.parse(projectsFromStorage);
        setProjects(parsedProjects);
      } catch (error) {
        console.error("Failed to parse projects data:", error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || !projects.length) return;

    // Находим задачи, назначенные на текущего пользователя
    const tasks: {project: Project; task: Task}[] = [];
    
    projects.forEach(project => {
      project.tasks.forEach(task => {
        // Проверяем назначен ли этот пользователь на задачу:
        // 1. По ID в массиве assignedTo
        // 2. По имени пользователя в массиве assignedToNames
        const assignedById = Array.isArray(task.assignedTo) && task.assignedTo.includes(user.id);
        const assignedByName = Array.isArray(task.assignedToNames) && task.assignedToNames.includes(userName);
        const assignedBySingleId = task.assignedTo === user.id;
        
        if (assignedById || assignedByName || assignedBySingleId) {
          tasks.push({project, task});
        }
      });
    });
    
    setUserTasks(tasks);
  }, [user, projects, userName]);

  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    // Если задача завершена на 100%, устанавливаем actualEndDate
    if (updatedTask.progress === 100 && !updatedTask.actualEndDate) {
      updatedTask.actualEndDate = new Date().toISOString();
    }
    
    // Обновляем массив проектов
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    
    // Обновляем список задач сотрудника
    const updatedUserTasks = userTasks.map(item => {
      if (item.project.id === projectId && item.task.id === updatedTask.id) {
        return {
          project: updatedProjects.find(p => p.id === projectId)!,
          task: updatedTask
        };
      }
      return item;
    });
    
    setUserTasks(updatedUserTasks);
    
    toast({
      title: "Задача обновлена",
      description: `Прогресс задачи "${updatedTask.name}" установлен на ${updatedTask.progress}%`,
    });
  };
  
  // Обработчик выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Личный кабинет сотрудника</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user.username} (Сотрудник)
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Мои задачи</CardTitle>
              <CardDescription>
                Задачи, назначенные на вас
              <EmployeeTaskList 
                tasks={userTasks} 
                userId={user.id}
                onTaskUpdate={(projectId, updatedTask) => {
                  // Если задача завершена на 100%, устанавливаем actualEndDate
                  if (updatedTask.progress === 100 && !updatedTask.actualEndDate) {
                    updatedTask.actualEndDate = new Date().toISOString();
                  }
                  handleTaskUpdate(projectId, updatedTask);
                }}
              />
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Доступные задачи</CardTitle>
              <CardDescription>
                Задачи, которые можно взять в работу
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvailableTasks 
                projects={projects} 
                userId={user.id}
                onTaskUpdate={handleTaskUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Компонент для отображения доступных задач
const AvailableTasks = ({ 
  projects, 
  userId,
  onTaskUpdate 
}: { 
  projects: Project[], 
  userId: string,
  onTaskUpdate: (projectId: string, task: Task) => void 
}) => {
  const availableTasks: {project: Project, task: Task}[] = [];
  
  projects.forEach(project => {
    project.tasks.forEach(task => {
      // Показываем задачи без исполнителей или задачи, которые можно взять нескольким исполнителям
      const isAssigned = Array.isArray(task.assignedTo) 
        ? task.assignedTo.includes(userId)
        : task.assignedTo === userId;
        
      if (!task.assignedTo || !isAssigned) {
        availableTasks.push({
          project,
          task
        });
      }
    });
  });
  
  const handleAssignTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId)!;
    const task = project.tasks.find(t => t.id === taskId)!;
    
    // Обновляем assignedTo, сохраняя список исполнителей если он уже существует
    let updatedAssignedTo: string | string[] = userId;
    
    if (task.assignedTo) {
      if (Array.isArray(task.assignedTo)) {
        updatedAssignedTo = [...task.assignedTo, userId];
      } else if (task.assignedTo !== userId) {
        updatedAssignedTo = [task.assignedTo, userId];
      }
    }
    
    const updatedTask: Task = {
      ...task,
      assignedTo: updatedAssignedTo,
      actualStartDate: task.actualStartDate || new Date().toISOString()
    };
    
    onTaskUpdate(projectId, updatedTask);
  };
  
  if (availableTasks.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        Нет доступных задач
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {availableTasks.map(({ project, task }) => (
        <div 
          key={task.id} 
          className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-slate-900">{task.name}</p>
              <p className="text-sm text-slate-500 mt-1">
                Проект: {project.name}
              </p>
              <p className="text-sm text-slate-700 mt-2">
                {task.description}
              </p>
              {task.comments && task.comments.length > 0 && (
                <div className="mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {task.comments.map((comment, index) => (
                      <li key={index} className="text-gray-600">{comment}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Цена: {task.price} ₽
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  Время: {task.estimatedTime} ч
                </span>
              </div>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleAssignTask(project.id, task.id)}
            >
              Взять в работу
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Employee;