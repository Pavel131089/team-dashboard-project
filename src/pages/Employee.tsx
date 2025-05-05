
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
  
  const { userTasks, setUserTasks } = useUserTasks(user, projects, userName);

  // Загрузка данных пользователя и проектов при первом рендере
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
