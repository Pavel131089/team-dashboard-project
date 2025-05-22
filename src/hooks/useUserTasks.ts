
import { useState, useEffect } from "react";
import { Project, Task, User } from "@/types/project";

/**
 * Хук для получения задач, назначенных пользователю
 */
export function useUserTasks(
  user: User | null,
  projects: Project[],
  userName: string
) {
  const [userTasks, setUserTasks] = useState<{ project: Project; task: Task }[]>([]);

  // Обновляем список задач при изменении пользователя или проектов
  useEffect(() => {
    if (!user) {
      setUserTasks([]);
      return;
    }

    // Собираем все задачи из всех проектов, которые назначены текущему пользователю
    const tasks = projects.flatMap(project => {
      return project.tasks
        .filter(task => {
          // Проверяем, назначена ли задача текущему пользователю
          if (task.assignedTo === user.id) return true;
          if (task.assignedToNames?.includes(user.id)) return true;
          
          // Если userName передан и есть в списке назначенных имен
          if (userName && task.assignedToNames?.includes(userName)) return true;
          
          return false;
        })
        .map(task => ({ project, task }));
    });

    setUserTasks(tasks);
  }, [user, projects, userName]);

  return { userTasks };
}
