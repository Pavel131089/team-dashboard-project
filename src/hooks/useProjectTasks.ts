
import { useState } from "react";
import { Project, Task } from "@/types/project";

/**
 * Хук для управления задачами проектов
 */
export function useProjectTasks(
  projects: Project[],
  userTasks: { project: Project; task: Task }[]
) {
  /**
   * Обновляет задачу в проекте
   */
  const updateTask = (projectId: string, updatedTask: Task, userId?: string) => {
    try {
      // Получаем проекты из localStorage
      const storedProjects = localStorage.getItem("projects");
      if (!storedProjects) {
        console.error("Проекты не найдены в localStorage");
        return;
      }

      // Парсим проекты
      const parsedProjects: Project[] = JSON.parse(storedProjects);
      
      // Находим проект и обновляем задачу
      const updatedProjects = parsedProjects.map(project => {
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

      // Сохраняем обновленные проекты
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      
      // Обновляем состояние в родительском компоненте (если это нужно)
      // В этом хуке мы не управляем состоянием projects, оно передается как параметр
      
      console.log(`Задача ${updatedTask.id} в проекте ${projectId} обновлена`);
      
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  return {
    updateTask
  };
}
