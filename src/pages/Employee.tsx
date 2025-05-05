import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import EmployeeLayout from "@/components/employee/EmployeeLayout";
import EmployeeTasksCard from "@/components/employee/EmployeeTasksCard";
import AvailableTasksCard from "@/components/employee/AvailableTasksCard";
import { useUserTasks } from "@/hooks/useUserTasks";

const Employee = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  
  // Получаем задачи пользователя
  const { userTasks, setUserTasks } = useUserTasks(user, projects, userName);

  // Загрузка данных пользователя и проектов при первом рендере
  useEffect(() => {
    loadUserAndProjects();
  }, [navigate]);

  // Функция загрузки пользователя и проектов
  const loadUserAndProjects = () => {
    const userFromStorage = localStorage.getItem('user');
    const projectsFromStorage = localStorage.getItem('projects');
    
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
        setUserName(parsedUser.username || "");
        
        // Если пользователь руководитель, перенаправляем на страницу руководителя
        if (parsedUser.role === 'manager') {
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate("/login");
        return;
      }
    } else {
      navigate("/login");
      return;
    }
    
    if (projectsFromStorage) {
      try {
        const parsedProjects = JSON.parse(projectsFromStorage);
        setProjects(parsedProjects || []);
      } catch (error) {
        console.error("Failed to parse projects data:", error);
        setProjects([]); // Устанавливаем пустой массив в случае ошибки
      }
    } else {
      // Если проектов нет, создаем пустой массив в localStorage
      localStorage.setItem('projects', JSON.stringify([]));
      setProjects([]);
    }
  };

  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    // Проверяем, не пытаемся ли "удалить" задачу (флаг _deleted)
    if (updatedTask._deleted) {
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
          return;
        }
      }
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

  // Обработчик выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <EmployeeLayout 
      userName={user.username} 
      onLogout={handleLogout}
    >
      <div className="grid grid-cols-1 gap-6">
        <EmployeeTasksCard 
          userTasks={userTasks} 
          userId={user.id}
          onTaskUpdate={handleTaskUpdate}
        />
        
        <AvailableTasksCard 
          projects={projects} 
          userId={user.id}
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
    </EmployeeLayout>
  );
};

export default Employee;