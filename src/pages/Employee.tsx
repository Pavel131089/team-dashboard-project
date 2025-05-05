
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EmployeeStatusIndicator from "@/components/employee/EmployeeStatusIndicator";
import EmployeeContent from "@/components/employee/EmployeeContent";
import { Project, Task, User } from "@/types/project";
import authService from "@/services/authService";
import { getProjectsFromStorage } from "@/utils/storageUtils";

/**
 * Страница сотрудника
 * Отображает задачи сотрудника и доступные задачи, которые можно взять в работу
 */
const Employee = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userTasks, setUserTasks] = useState<{project: Project; task: Task}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Загрузка данных пользователя и проектов при первом рендере
  useEffect(() => {
    loadUserAndProjects();
  }, []);

  // Функция загрузки пользователя и проектов
  const loadUserAndProjects = () => {
    setIsLoading(true);
    
    // Получаем пользователя из localStorage
    const userFromStorage = localStorage.getItem('user');
    if (!userFromStorage) {
      setIsLoading(false);
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userFromStorage);
      if (!parsedUser.isAuthenticated) {
        navigate('/login');
        return;
      }
      
      setUser(parsedUser);
      
      // Если пользователь руководитель, перенаправляем на страницу руководителя
      if (parsedUser.role === 'manager') {
        navigate('/dashboard');
        return;
      }
      
      // Загружаем проекты
      const loadedProjects = getProjectsFromStorage();
      setProjects(loadedProjects);
      
      // Находим задачи, назначенные на этого пользователя
      const tasks: {project: Project; task: Task}[] = [];
      loadedProjects.forEach(project => {
        project.tasks.forEach(task => {
          if (isTaskAssignedToUser(task, parsedUser.id)) {
            tasks.push({project, task});
          }
        });
      });
      
      setUserTasks(tasks);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      setIsLoading(false);
    }
  };
  
  // Проверяет, назначена ли задача пользователю
  const isTaskAssignedToUser = (task: Task, userId: string): boolean => {
    if (Array.isArray(task.assignedTo)) {
      return task.assignedTo.includes(userId);
    }
    return task.assignedTo === userId;
  };
  
  // Обработчик обновления задачи
  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    // Создаем копию массива проектов
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        // Обновляем задачу в проекте
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        };
      }
      return project;
    });
    
    // Обновляем задачу в userTasks
    const updatedUserTasks = userTasks.map(item => {
      if (item.project.id === projectId && item.task.id === updatedTask.id) {
        return {
          project: updatedProjects.find(p => p.id === projectId)!,
          task: updatedTask
        };
      }
      return item;
    });
    
    // Обновляем state
    setProjects(updatedProjects);
    setUserTasks(updatedUserTasks);
    
    // Сохраняем в localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };
  
  // Функция выхода из системы
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Отображаем индикатор загрузки или ошибку, если нет данных пользователя
  if (isLoading) {
    return <EmployeeStatusIndicator isLoading={true} hasUser={false} />;
  }
  
  if (!user) {
    return <EmployeeStatusIndicator isLoading={false} hasUser={false} />;
  }

  // Отображаем основной контент страницы сотрудника
  return (
    <EmployeeContent
      user={user}
      projects={projects}
      userTasks={userTasks}
      onTaskUpdate={handleTaskUpdate}
      onLogout={handleLogout}
    />
  );
};

export default Employee;
