
import { useState } from "react";
import { Project, Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import { 
  updateTaskInProjects, 
  updateUserTasksList, 
  removeTaskFromUserTasks,
  removeUserFromTaskAssignees,
  updateTaskCompletionDate
} from "@/utils/taskUtils";
import { saveProjectsToStorage } from "@/utils/storageUtils";

/**
 * Хук для работы с задачами проектов
 */
export function useProjectTasks(
  initialProjects: Project[],
  initialUserTasks: {project: Project; task: Task}[]
) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [userTasks, setUserTasks] = useState<{project: Project; task: Task}[]>(initialUserTasks);
  
  /**
   * Обработчик обновления задачи
   */
  const updateTask = (projectId: string, updatedTask: Task, userId: string) => {
    // Проверяем, не пытаемся ли "удалить" задачу (флаг _deleted)
    if (updatedTask._deleted) {
      deleteTask(projectId, updatedTask, userId);
      return;
    }
    
    // Обновляем дату окончания, если задача завершена
    const taskWithCompletionDate = updateTaskCompletionDate(updatedTask);
    
    // Обновляем массив проектов
    const updatedProjects = updateTaskInProjects(projects, projectId, taskWithCompletionDate);
    setProjects(updatedProjects);
    saveProjectsToStorage(updatedProjects);
    
    // Обновляем список задач сотрудника
    const updatedUserTasks = updateUserTasksList(
      userTasks, 
      projectId, 
      taskWithCompletionDate, 
      updatedProjects
    );
    
    setUserTasks(updatedUserTasks);
    
    toast({
      title: "Задача обновлена",
      description: `Прогресс задачи "${updatedTask.name}" установлен на ${updatedTask.progress}%`,
    });
  };
  
  /**
   * Обработчик удаления задачи
   */
  const deleteTask = (projectId: string, taskToDelete: Task, userId: string) => {
    // Удаляем задачу из списка задач пользователя
    const updatedUserTasks = removeTaskFromUserTasks(
      userTasks, 
      projectId, 
      taskToDelete.id
    );
    
    setUserTasks(updatedUserTasks);
    
    // Обновляем проект, удаляя пользователя из списка исполнителей задачи
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      const task = project.tasks.find(t => t.id === taskToDelete.id);
      
      if (task) {
        const taskWithoutUser = removeUserFromTaskAssignees(task, userId);
        
        // Обновляем проект
        const updatedProjects = updateTaskInProjects(
          projects, 
          projectId, 
          taskWithoutUser
        );
        
        setProjects(updatedProjects);
        saveProjectsToStorage(updatedProjects);
        
        toast({
          title: "Задача удалена",
          description: "Задача была успешно удалена из вашего списка",
        });
      }
    }
  };
  
  return {
    projects,
    userTasks,
    updateTask,
    deleteTask
  };
}
