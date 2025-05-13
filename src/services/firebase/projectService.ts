
/**
 * Сервис для работы с проектами и задачами (имитация Firebase Firestore)
 * Использует localStorage вместо Firestore
 */
import { Project, Task } from "@/types/project";

export const firebaseProjectService = {
  /**
   * Получение всех проектов
   */
  async getAllProjects(): Promise<Project[]> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      return JSON.parse(projectsStr);
    } catch (error) {
      console.error("Ошибка при получении проектов:", error);
      return [];
    }
  },

  /**
   * Получение проекта по ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      return projects.find((p: Project) => p.id === projectId) || null;
    } catch (error) {
      console.error("Ошибка при получении проекта:", error);
      return null;
    }
  },

  /**
   * Получение проектов пользователя
   */
  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Фильтруем проекты, созданные пользователем
      return projects.filter((p: Project) => p.createdBy === userId);
    } catch (error) {
      console.error("Ошибка при получении проектов пользователя:", error);
      return [];
    }
  },

  /**
   * Создание нового проекта
   */
  async createProject(project: Omit<Project, "id">): Promise<Project | null> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Генерируем ID проекта
      const projectId = crypto.randomUUID();
      
      // Установка дат создания и обновления
      const now = new Date();
      const projectWithDates = {
        ...project,
        id: projectId,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      
      // Добавляем проект в список
      projects.push(projectWithDates);
      localStorage.setItem("projects", JSON.stringify(projects));
      
      return projectWithDates;
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
      return null;
    }
  },

  /**
   * Обновление проекта
   */
  async updateProject(projectId: string, projectData: Partial<Project>): Promise<boolean> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Обновляем проект
      const updatedProjects = projects.map((p: Project) => {
        if (p.id === projectId) {
          return { 
            ...p, 
            ...projectData,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении проекта:", error);
      return false;
    }
  },

  /**
   * Удаление проекта
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Фильтруем проекты
      const updatedProjects = projects.filter((p: Project) => p.id !== projectId);
      
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error("Ошибка при удалении проекта:", error);
      return false;
    }
  },

  /**
   * Добавление задачи в проект
   */
  async addTaskToProject(projectId: string, task: Omit<Task, "id">): Promise<Task | null> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Находим проект
      const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
      if (projectIndex === -1) {
        console.error("Проект не найден");
        return null;
      }
      
      // Генерируем ID задачи
      const taskId = crypto.randomUUID();
      const newTask = { id: taskId, ...task };
      
      // Добавляем задачу в проект
      const project = projects[projectIndex];
      const updatedProject = {
        ...project,
        tasks: [...project.tasks, newTask],
        updatedAt: new Date().toISOString()
      };
      
      projects[projectIndex] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
      
      return newTask;
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      return null;
    }
  },

  /**
   * Обновление задачи в проекте
   */
  async updateTaskInProject(projectId: string, taskId: string, taskData: Partial<Task>): Promise<boolean> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Находим проект
      const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
      if (projectIndex === -1) {
        console.error("Проект не найден");
        return false;
      }
      
      // Обновляем задачу
      const project = projects[projectIndex];
      const updatedTasks = project.tasks.map((task: Task) => {
        if (task.id === taskId) {
          return { ...task, ...taskData };
        }
        return task;
      });
      
      const updatedProject = {
        ...project,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      };
      
      projects[projectIndex] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
      
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      return false;
    }
  },

  /**
   * Удаление задачи из проекта
   */
  async deleteTaskFromProject(projectId: string, taskId: string): Promise<boolean> {
    try {
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      
      // Находим проект
      const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
      if (projectIndex === -1) {
        console.error("Проект не найден");
        return false;
      }
      
      // Удаляем задачу
      const project = projects[projectIndex];
      const updatedTasks = project.tasks.filter((task: Task) => task.id !== taskId);
      
      const updatedProject = {
        ...project,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString()
      };
      
      projects[projectIndex] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
      
      return true;
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      return false;
    }
  }
};

export default firebaseProjectService;
