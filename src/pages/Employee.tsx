import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task, User } from "@/types/project";
import EmployeeTaskList from "@/components/EmployeeTaskList";

const Employee = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [myTasks, setMyTasks] = useState<{project: Project, task: Task}[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    // Проверка авторизации
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(userStr) as User;
    if (!userData.isAuthenticated) {
      navigate("/login");
      return;
    }
    
    setUser(userData);
    
    // Загрузка проектов из localStorage (в реальном приложении будет API)
    const projectsStr = localStorage.getItem("projects");
    if (projectsStr) {
      const allProjects = JSON.parse(projectsStr) as Project[];
      setProjects(allProjects);
      
      // Фильтрация задач сотрудника
      const employeeTasks: {project: Project, task: Task}[] = [];
      
      allProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (task.assignedTo && (
            Array.isArray(task.assignedTo) 
              ? task.assignedTo.includes(userData.id)
              : task.assignedTo === userData.id
          )) {
            employeeTasks.push({
              project,
              task
            });
          }
        });
      });
      
      setMyTasks(employeeTasks);
    }
  }, [navigate]);

  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    // Обновляем задачу в проекте
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
    const updatedMyTasks = myTasks.map(item => {
      if (item.project.id === projectId && item.task.id === updatedTask.id) {
        return {
          project: updatedProjects.find(p => p.id === projectId)!,
          task: updatedTask
        };
      }
      return item;
    });
    
    setMyTasks(updatedMyTasks);
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
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeTaskList 
                tasks={myTasks} 
                userId={user.id}
                onTaskUpdate={handleTaskUpdate}
              />
            </CardContent>
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
      if (!task.assignedTo) {
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
    
    const updatedTask: Task = {
      ...task,
      assignedTo: userId,
      actualStartDate: new Date().toISOString()
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