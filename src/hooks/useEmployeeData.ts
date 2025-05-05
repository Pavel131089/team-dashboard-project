
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import { useUserTasks } from "./useUserTasks";

export function useEmployeeData(navigate: NavigateFunction) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Получаем задачи пользователя
  const { userTasks, setUserTasks } = useUserTasks(user, projects, userName);

  // Загрузка данных пользователя и проектов при первом рендере
  useEffect(() => {
    loadUserAndProjects();
  }, [navigate]);

  // Функция загрузки пользователя и проектов
  const loadUserAndProjects = () => {
    setIsLoading(true);
    
    // Загрузка пользователя из localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        
        // Проверяем, что пользователь аутентифицирован
        if (!parsedUser.isAuthenticated) {
          redirectToLogin("Сессия истекла. Пожалуйста, войдите снова.");
          return;
        }
        
        setUser(parsedUser);
        setUserName(parsedUser.username || "");
        
        // Если пользователь руководитель, перенаправляем на страницу руководителя
        if (parsedUser.role === 'manager') {
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        redirectToLogin("Проблема с данными сессии. Пожалуйста, войдите снова.");
        return;
      }
    } else {
      redirectToLogin();
      return;
    }
    
    // Загрузка проектов
    loadProjects();
    setIsLoading(false);
  };
  
  // Функция загрузки проектов
  const loadProjects = () => {
    const projectsFromStorage = localStorage.getItem('projects');
    if (projectsFromStorage) {
      try {
        const parsedProjects = JSON.parse(projectsFromStorage);
        setProjects(parsedProjects || []);
      } catch (error) {
        console.error("Failed to parse projects data:", error);
        setProjects([]); // Устанавливаем пустой массив в случае ошибки
        localStorage.setItem('projects', JSON.stringify([]));
      }
    } else {
      // Если проектов нет, создаем пустой массив в localStorage
      localStorage.setItem('projects', JSON.stringify([]));
      setProjects([]);
    }
  };
  
  // Вспомогательная функция для перенаправления на страницу входа
  const redirectToLogin = (message?: string) => {
    if (message) {
      // Устанавливаем сообщение для отображения на странице входа
      sessionStorage.setItem('auth_message', message);
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Обработчик обновления задачи
  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    // Проверяем, не пытаемся ли "удалить" задачу (флаг _deleted)
    if (updatedTask._deleted) {
      handleTaskDeletion(projectId, updatedTask);
      return;
    }
    
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

  // Обработчик удаления задачи
  const handleTaskDeletion = (projectId: string, updatedTask: Task) => {
    // Удаляем задачу из списка задач пользователя
    const updatedUserTasks = userTasks.filter(
      item => !(item.project.id === projectId && item.task.id === updatedTask.id)
    );
    setUserTasks(updatedUserTasks);
    
    // Обновляем проект, удаляя пользователя из списка исполнителей задачи
    const project = projects.find(p => p.id === projectId);
    if (project && user) {
      const task = project.tasks.find(t => t.id === updatedTask.id);
      if (task) {
        let newAssignedTo = task.assignedTo;
        
        if (Array.isArray(newAssignedTo)) {
          newAssignedTo = newAssignedTo.filter(id => id !== user.id);
          // Если остался только 1 исполнитель, преобразуем массив в строку
          if (newAssignedTo.length === 1) {
            newAssignedTo = newAssignedTo[0];
          } else if (newAssignedTo.length === 0) {
            newAssignedTo = null;
          }
        } else {
          newAssignedTo = null;
        }
        
        const taskWithoutUser = {
          ...task,
          assignedTo: newAssignedTo
        };
        
        // Обновляем проект
        const updatedProjects = projects.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: p.tasks.map(t => t.id === updatedTask.id ? taskWithoutUser : t)
            };
          }
          return p;
        });
        
        setProjects(updatedProjects);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        
        toast({
          title: "Задача удалена",
          description: "Задача была успешно удалена из вашего списка",
        });
      }
    }
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return {
    user,
    projects,
    userTasks,
    isLoading,
    handleTaskUpdate,
    handleLogout
  };
}
