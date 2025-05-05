
/**
 * Управление проектами в хранилище
 * @module storage/projects
 */

import JsonStorage from './json';
import STORAGE_KEYS from './keys';

/**
 * Тип для проекта
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

/**
 * Тип для задачи
 */
export interface Task {
  id: string;
  name: string;
  description?: string;
  price?: number;
  estimatedTime?: number;
  progress?: number;
  startDate?: string;
  endDate?: string;
  assignedTo?: string | string[] | null;
  [key: string]: any;
}

/**
 * Модуль для управления проектами в хранилище
 */
export const ProjectStorage = {
  /**
   * Получает все проекты из хранилища
   * @returns {Project[]} Массив проектов или пустой массив
   */
  getProjects(): Project[] {
    return JsonStorage.getItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
  },

  /**
   * Сохраняет проекты в хранилище
   * @param {Project[]} projects - Массив проектов
   * @returns {boolean} Результат операции
   */
  saveProjects(projects: Project[]): boolean {
    return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, projects);
  },

  /**
   * Добавляет новый проект в хранилище
   * @param {Project} project - Новый проект
   * @returns {boolean} Результат операции
   */
  addProject(project: Project): boolean {
    return JsonStorage.updateItem<Project[]>(
      STORAGE_KEYS.PROJECTS,
      (projects) => [...projects, project],
      []
    );
  },

  /**
   * Обновляет существующий проект
   * @param {string} projectId - ID проекта для обновления
   * @param {Partial<Project>} updatedProject - Обновленные данные проекта
   * @returns {boolean} Результат операции
   */
  updateProject(projectId: string, updatedProject: Partial<Project>): boolean {
    return JsonStorage.updateItem<Project[]>(
      STORAGE_KEYS.PROJECTS,
      (projects) => projects.map(p => 
        p.id === projectId ? { ...p, ...updatedProject, updatedAt: new Date().toISOString() } : p
      ),
      []
    );
  },

  /**
   * Удаляет проект из хранилища
   * @param {string} projectId - ID проекта для удаления
   * @returns {boolean} Результат операции
   */
  deleteProject(projectId: string): boolean {
    return JsonStorage.updateItem<Project[]>(
      STORAGE_KEYS.PROJECTS,
      (projects) => projects.filter(p => p.id !== projectId),
      []
    );
  },

  /**
   * Обновляет задачу в проекте
   * @param {string} projectId - ID проекта
   * @param {string} taskId - ID задачи
   * @param {Partial<Task>} updatedTask - Обновленные данные задачи
   * @returns {boolean} Результат операции
   */
  updateTask(projectId: string, taskId: string, updatedTask: Partial<Task>): boolean {
    return JsonStorage.updateItem<Project[]>(
      STORAGE_KEYS.PROJECTS,
      (projects) => projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            updatedAt: new Date().toISOString(),
            tasks: project.tasks.map(task => 
              task.id === taskId ? { ...task, ...updatedTask } : task
            )
          };
        }
        return project;
      }),
      []
    );
  },

  /**
   * Добавляет задачу в проект
   * @param {string} projectId - ID проекта
   * @param {Task} newTask - Новая задача
   * @returns {boolean} Результат операции
   */
  addTask(projectId: string, newTask: Task): boolean {
    return JsonStorage.updateItem<Project[]>(
      STORAGE_KEYS.PROJECTS,
      (projects) => projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            updatedAt: new Date().toISOString(),
            tasks: [...project.tasks, newTask]
          };
        }
        return project;
      }),
      []
    );
  },

  /**
   * Удаляет задачу из проекта
   * @param {string} projectId - ID проекта
   * @param {string} taskId - ID задачи
   * @returns {boolean} Результат операции
   */
  deleteTask(projectId: string, taskId: string): boolean {
    return JsonStorage.updateItem<Project[]>(
      STORAGE_KEYS.PROJECTS,
      (projects) => projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            updatedAt: new Date().toISOString(),
            tasks: project.tasks.filter(task => task.id !== taskId)
          };
        }
        return project;
      }),
      []
    );
  }
};

export default ProjectStorage;
