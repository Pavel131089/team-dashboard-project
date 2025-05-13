
/**
 * Сервис для работы с проектами и задачами (имитация Firebase Firestore)
 * Использует localStorage вместо Firestore
 */
import { Project, Task } from "@/types/project";
import { storageUtils } from "../storageUtils";

// Ключи для хранения данных в localStorage
const STORAGE_KEYS = {
  PROJECTS: 'projects'
};

/**
 * Модуль для работы с локальным хранилищем проектов
 * Инкапсулирует базовые операции чтения/записи
 */
const projectStorageModule = {
  /**
   * Получает все проекты из localStorage
   * @returns Массив проектов или пустой массив
   */
  getProjects(): Project[] {
    return storageUtils.getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
  },

  /**
   * Сохраняет проекты в localStorage
   * @param projects - Массив проектов для сохранения
   * @returns true, если сохранение успешно
   */
  saveProjects(projects: Project[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении проектов:", error);
      return false;
    }
  }
};

/**
 * Модуль для работы с проектами
 * Обеспечивает операции получения, создания, обновления и удаления проектов
 */
const projectModule = {
  /**
   * Получает проект по ID
   * @param projectId - ID проекта
   * @returns Проект или null, если не найден
   */
  getProjectById(projectId: string): Promise<Project | null> {
    try {
      const projects = projectStorageModule.getProjects();
      return Promise.resolve(projects.find(p => p.id === projectId) || null);
    } catch (error) {
      console.error("Ошибка при получении проекта:", error);
      return Promise.resolve(null);
    }
  },

  /**
   * Получает проекты, созданные пользователем
   * @param userId - ID пользователя
   * @returns Массив проектов пользователя
   */
  getUserProjects(userId: string): Promise<Project[]> {
    try {
      const projects = projectStorageModule.getProjects();
      // Фильтруем проекты, созданные пользователем
      return Promise.resolve(projects.filter(p => p.createdBy === userId));
    } catch (error) {
      console.error("Ошибка при получении проектов пользователя:", error);
      return Promise.resolve([]);
    }
  },

  /**
   * Создает новый проект
   * @param project - Данные проекта без ID
   * @returns Созданный проект с ID или null при ошибке
   */
  createProject(project: Omit<Project, "id">): Promise<Project | null> {
    try {
      const projects = projectStorageModule.getProjects();
      
      // Генерируем ID проекта и добавляем метаданные
      const now = new Date();
      const newProject: Project = {
        ...project,
        id: crypto.randomUUID(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      
      // Добавляем проект в список и сохраняем
      projects.push(newProject);
      projectStorageModule.saveProjects(projects);
      
      return Promise.resolve(newProject);
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
      return Promise.resolve(null);
    }
  },

  /**
   * Обновляет существующий проект
   * @param projectId - ID проекта
   * @param projectData - Данные для обновления
   * @returns true при успешном обновлении
   */
  updateProject(projectId: string, projectData: Partial<Project>): Promise<boolean> {
    try {
      const projects = projectStorageModule.getProjects();
      
      // Ищем проект для обновления
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        console.warn(`Проект с ID ${projectId} не найден`);
        return Promise.resolve(false);
      }
      
      // Обновляем проект
      projects[projectIndex] = {
        ...projects[projectIndex],
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      
      projectStorageModule.saveProjects(projects);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Ошибка при обновлении проекта:", error);
      return Promise.resolve(false);
    }
  },

  /**
   * Удаляет проект
   * @param projectId - ID проекта для удаления
   * @returns true при успешном удалении
   */
  deleteProject(projectId: string): Promise<boolean> {
    try {
      const projects = projectStorageModule.getProjects();
      
      // Фильтруем проекты, удаляя проект с указанным ID
      const filteredProjects = projects.filter(p => p.id !== projectId);
      
      // Если количество проектов не изменилось, значит проект не найден
      if (filteredProjects.length === projects.length) {
        console.warn(`Проект с ID ${projectId} не найден для удаления`);
        return Promise.resolve(false);
      }
      
      projectStorageModule.saveProjects(filteredProjects);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Ошибка при удалении проекта:", error);
      return Promise.resolve(false);
    }
  }
};

/**
 * Модуль для работы с задачами проекта
 * Обеспечивает операции добавления, обновления и удаления задач
 */
const taskModule = {
  /**
   * Добавляет задачу в проект
   * @param projectId - ID проекта
   * @param task - Данные задачи без ID
   * @returns Созданная задача с ID или null при ошибке
   */
  addTaskToProject(projectId: string, task: Omit<Task, "id">): Promise<Task | null> {
    try {
      const projects = projectStorageModule.getProjects();
      
      // Находим проект
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        console.error(`Проект с ID ${projectId} не найден`);
        return Promise.resolve(null);
      }
      
      // Создаем новую задачу с ID
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...task
      };
      
      // Добавляем задачу в проект
      const updatedProject: Project = {
        ...projects[projectIndex],
        tasks: [...projects[projectIndex].tasks, newTask],
        updatedAt: new Date().toISOString()
      };
      
      projects[projectIndex] = updatedProject;
      projectStorageModule.saveProjects(projects);
      
      return Promise.resolve(newTask);
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      return Promise.resolve(null);
    }
  },

  /**
   * Обновляет задачу в проекте
   * @param projectId - ID проекта
   * @param taskId - ID задачи
   * @param taskData - Данные для обновления
   * @returns true при успешном обновлении
   */
  updateTaskInProject(projectId: string, taskId: string, taskData: Partial<Task>): Promise<boolean> {
    try {
      const projects = projectStorageModule.getProjects();
      
      // Находим проект
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        console.error(`Проект с ID ${projectId} не найден`);
        return Promise.resolve(false);
      }
      
      const project = projects[projectIndex];
      
      // Находим задачу
      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        console.error(`Задача с ID ${taskId} не найдена в проекте ${projectId}`);
        return Promise.resolve(false);
      }
      
      // Обновляем задачу
      const updatedTask = {
        ...project.tasks[taskIndex],
        ...taskData
      };
      
      // Создаем новый массив задач с обновленной задачей
      const updatedTasks = [
        ...project.tasks.slice(0, taskIndex),
        updatedTask,
        ...project.tasks.slice(taskIndex + 1)
      ];
      
      // Обновляем проект
      projects[projectIndex] = {
        ...project,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      };
      
      projectStorageModule.saveProjects(projects);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      return Promise.resolve(false);
    }
  },

  /**
   * Удаляет задачу из проекта
   * @param projectId - ID проекта
   * @param taskId - ID задачи
   * @returns true при успешном удалении
   */
  deleteTaskFromProject(projectId: string, taskId: string): Promise<boolean> {
    try {
      const projects = projectStorageModule.getProjects();
      
      // Находим проект
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) {
        console.error(`Проект с ID ${projectId} не найден`);
        return Promise.resolve(false);
      }
      
      const project = projects[projectIndex];
      
      // Фильтруем задачи, удаляя задачу с указанным ID
      const filteredTasks = project.tasks.filter(t => t.id !== taskId);
      
      // Если количество задач не изменилось, значит задача не найдена
      if (filteredTasks.length === project.tasks.length) {
        console.warn(`Задача с ID ${taskId} не найдена в проекте ${projectId}`);
        return Promise.resolve(false);
      }
      
      // Обновляем проект
      projects[projectIndex] = {
        ...project,
        tasks: filteredTasks,
        updatedAt: new Date().toISOString()
      };
      
      projectStorageModule.saveProjects(projects);
      return Promise.resolve(true);
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      return Promise.resolve(false);
    }
  }
};

/**
 * Основной экспортируемый объект сервиса для работы с проектами
 * Объединяет все необходимые операции с проектами и задачами
 */
export const firebaseProjectService = {
  // API для работы с проектами
  getAllProjects: async (): Promise<Project[]> => {
    return projectStorageModule.getProjects();
  },
  getProjectById: projectModule.getProjectById,
  getUserProjects: projectModule.getUserProjects,
  createProject: projectModule.createProject,
  updateProject: projectModule.updateProject,
  deleteProject: projectModule.deleteProject,
  
  // API для работы с задачами
  addTaskToProject: taskModule.addTaskToProject,
  updateTaskInProject: taskModule.updateTaskInProject,
  deleteTaskFromProject: taskModule.deleteTaskFromProject
};

export default firebaseProjectService;
