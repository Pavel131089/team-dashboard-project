
/**
 * Сервис для работы с проектами через Supabase
 * 
 * ВНИМАНИЕ: Это только шаблон сервиса.
 * Требуется установка и настройка Supabase для полноценной работы.
 */
import supabaseClient from '@/config/supabase';
import { Project, Task } from '@/types/project';

/**
 * Сервис для работы с проектами в Supabase
 */
export const projectService = {
  /**
   * Получение всех проектов
   */
  async getProjects(): Promise<Project[]> {
    try {
      // В реальном коде будет примерно так:
      // const { data, error } = await supabaseClient
      //   .from('projects')
      //   .select('*');
      
      // if (error) throw error;
      // return data as Project[];

      // Временное решение - берем проекты из localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      return JSON.parse(projectsStr);
    } catch (error) {
      console.error('Ошибка при получении проектов:', error);
      return [];
    }
  },

  /**
   * Получение проекта по ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      // В реальном коде будет примерно так:
      // const { data, error } = await supabaseClient
      //   .from('projects')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      
      // if (error) throw error;
      // return data as Project;

      // Временное решение - ищем проект в localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(projectsStr);
      return projects.find((p: Project) => p.id === id) || null;
    } catch (error) {
      console.error(`Ошибка при получении проекта ${id}:`, error);
      return null;
    }
  },

  /**
   * Создание нового проекта
   */
  async createProject(project: Omit<Project, 'id'>): Promise<Project | null> {
    try {
      // В реальном коде будет примерно так:
      // const { data, error } = await supabaseClient
      //   .from('projects')
      //   .insert([project])
      //   .select();
      
      // if (error) throw error;
      // return data[0] as Project;

      // Временное решение - добавляем проект в localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(projectsStr);
      
      const newProject = {
        ...project,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      projects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));
      
      return newProject;
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      return null;
    }
  },

  /**
   * Обновление проекта
   */
  async updateProject(id: string, projectData: Partial<Project>): Promise<boolean> {
    try {
      // В реальном коде будет примерно так:
      // const { error } = await supabaseClient
      //   .from('projects')
      //   .update(projectData)
      //   .eq('id', id);
      
      // if (error) throw error;
      // return true;

      // Временное решение - обновляем проект в localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(projectsStr);
      
      const updatedProjects = projects.map((p: Project) => {
        if (p.id === id) {
          return { 
            ...p, 
            ...projectData,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error(`Ошибка при обновлении проекта ${id}:`, error);
      return false;
    }
  },

  /**
   * Удаление проекта
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      // В реальном коде будет примерно так:
      // const { error } = await supabaseClient
      //   .from('projects')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      // return true;

      // Временное решение - удаляем проект из localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(projectsStr);
      
      const filteredProjects = projects.filter((p: Project) => p.id !== id);
      localStorage.setItem('projects', JSON.stringify(filteredProjects));
      
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении проекта ${id}:`, error);
      return false;
    }
  },

  /**
   * Добавление задачи в проект
   */
  async addTask(projectId: string, task: Omit<Task, 'id'>): Promise<Task | null> {
    try {
      // В реальном мире с Supabase было бы отдельное API для задач
      // или обновление массива задач в документе проекта
      
      // Временное решение - добавляем задачу в localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(projectsStr);
      
      const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
      if (projectIndex === -1) {
        throw new Error(`Проект с ID ${projectId} не найден`);
      }
      
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
      };
      
      projects[projectIndex].tasks.push(newTask);
      projects[projectIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem('projects', JSON.stringify(projects));
      
      return newTask;
    } catch (error) {
      console.error(`Ошибка при добавлении задачи в проект ${projectId}:`, error);
      return null;
    }
  },

  /**
   * Обновление задачи в проекте
   */
  async updateTask(projectId: string, taskId: string, taskData: Partial<Task>): Promise<boolean> {
    try {
      // В реальном мире с Supabase было бы отдельное API для задач
      // или обновление элемента в массиве задач
      
      // Временное решение - обновляем задачу в localStorage
      const projectsStr = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(projectsStr);
      
      const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
      if (projectIndex === -1) {
        throw new Error(`Проект с ID ${projectId} не найден`);
      }
      
      const taskIndex = projects[projectIndex].tasks.findIndex(
        (t: Task) => t.id === taskId
      );
      
      if (taskIndex === -1) {
        throw new Error(`Задача с ID ${taskId} не найдена`);
      }
      
      projects[projectIndex].tasks[taskIndex] = {
        ...projects[projectIndex].tasks[taskIndex],
        ...taskData,
      };
      
      projects[projectIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('projects', JSON.stringify(projects));
      
      return true;
    } catch (error) {
      console.error(`Ошибка при обновлении задачи ${taskId}:`, error);
      return false;
    }
  }
};

export default projectService;
