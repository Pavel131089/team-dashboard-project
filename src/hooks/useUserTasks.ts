import { useState, useEffect } from "react");
import { Project, Task, User } from "@/types/project";

export function useUserTasks(
  user: User | null, 
  projects: Project[], 
  userName: string
) {
  const [userTasks, setUserTasks] = useState<{project: Project; task: Task}[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Проверка на пустые проекты
    if (!projects || projects.length === 0) {
      setUserTasks([]);
      return;
    }
    
    // Находим задачи, назначенные на текущего пользователя
    const tasks: {project: Project; task: Task}[] = [];
    
    projects.forEach(project => {
      project.tasks.forEach(task => {
        // Проверяем назначен ли этот пользователь на задачу:
        // 1. По ID в массиве assignedTo
        // 2. По имени пользователя в массиве assignedToNames
        // 3. По прямому равенству assignedTo === user.id
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

  return { userTasks, setUserTasks };
}