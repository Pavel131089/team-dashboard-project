
/**
 * Модуль утилит для работы с локальным хранилищем браузера.
 * Предоставляет функции для безопасного сохранения, получения и управления данными.
 */

// Константы для работы с хранилищем
const STORAGE_KEYS = {
  PROJECTS: 'projects',
  USERS: 'users',
  SESSION: 'user',
  AUTH_MESSAGE: 'auth_message'
};

/**
 * Базовые операции с локальным хранилищем
 */
export const StorageCore = {
  /**
   * Проверяет доступность localStorage
   * @returns {boolean} True если хранилище доступно, иначе false
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      const result = localStorage.getItem(testKey) === testKey;
      localStorage.removeItem(testKey);
      return result;
    } catch (e) {
      console.error('Локальное хранилище не доступно:', e);
      return false;
    }
  },

  /**
   * Безопасно получает данные из localStorage
   * @param {string} key - Ключ для чтения
   * @returns {string|null} Данные из хранилища или null при ошибке
   */
  getRawItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Ошибка при чтении из хранилища (${key}):`, error);
      return null;
    }
  },

  /**
   * Безопасно сохраняет данные в localStorage
   * @param {string} key - Ключ для сохранения
   * @param {string} value - Значение для сохранения
   * @returns {boolean} Результат операции
   */
  setRawItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Ошибка при записи в хранилище (${key}):`, error);
      return false;
    }
  },

  /**
   * Безопасно удаляет данные из localStorage
   * @param {string} key - Ключ для удаления
   * @returns {boolean} Результат операции
   */
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении из хранилища (${key}):`, error);
      return false;
    }
  }
};

/**
 * Утилиты для работы с JSON данными в хранилище
 */
export const JsonStorage = {
  /**
   * Получает и парсит JSON данные из localStorage
   * @param {string} key - Ключ для чтения
   * @param {T} defaultValue - Значение по умолчанию
   * @returns {T} Распарсенные данные или значение по умолчанию
   */
  getItem<T>(key: string, defaultValue: T): T {
    const raw = StorageCore.getRawItem(key);
    if (!raw) return defaultValue;

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`Ошибка при парсинге JSON из хранилища (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Сериализует и сохраняет данные в localStorage
   * @param {string} key - Ключ для сохранения
   * @param {T} value - Данные для сохранения
   * @returns {boolean} Результат операции
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      return StorageCore.setRawItem(key, serialized);
    } catch (error) {
      console.error(`Ошибка при сериализации данных для хранилища (${key}):`, error);
      return false;
    }
  },

  /**
   * Обновляет часть данных в хранилище
   * @param {string} key - Ключ для обновления
   * @param {Function} updateFn - Функция обновления
   * @param {T} defaultValue - Значение по умолчанию, если данных нет
   * @returns {boolean} Результат операции
   */
  updateItem<T>(key: string, updateFn: (data: T) => T, defaultValue: T): boolean {
    const currentData = this.getItem<T>(key, defaultValue);
    const updatedData = updateFn(currentData);
    return this.setItem(key, updatedData);
  }
};

/**
 * Управление проектами в хранилище
 */
export const ProjectStorage = {
  /**
   * Получает все проекты из хранилища
   * @returns {Array} Массив проектов или пустой массив
   */
  getProjects(): any[] {
    return JsonStorage.getItem(STORAGE_KEYS.PROJECTS, []);
  },

  /**
   * Сохраняет проекты в хранилище
   * @param {Array} projects - Массив проектов
   * @returns {boolean} Результат операции
   */
  saveProjects(projects: any[]): boolean {
    return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, projects);
  },

  /**
   * Добавляет новый проект в хранилище
   * @param {Object} project - Новый проект
   * @returns {boolean} Результат операции
   */
  addProject(project: any): boolean {
    return JsonStorage.updateItem(
      STORAGE_KEYS.PROJECTS,
      (projects: any[]) => [...projects, project],
      []
    );
  },

  /**
   * Обновляет существующий проект
   * @param {string} projectId - ID проекта для обновления
   * @param {Object} updatedProject - Обновленные данные проекта
   * @returns {boolean} Результат операции
   */
  updateProject(projectId: string, updatedProject: any): boolean {
    return JsonStorage.updateItem(
      STORAGE_KEYS.PROJECTS,
      (projects: any[]) => projects.map(p => 
        p.id === projectId ? { ...p, ...updatedProject } : p
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
    return JsonStorage.updateItem(
      STORAGE_KEYS.PROJECTS,
      (projects: any[]) => projects.filter(p => p.id !== projectId),
      []
    );
  }
};

/**
 * Управление задачами в проектах
 */
export const TaskStorage = {
  /**
   * Обновляет задачу в проекте
   * @param {string} projectId - ID проекта
   * @param {string} taskId - ID задачи
   * @param {Object} updatedTask - Обновленные данные задачи
   * @returns {boolean} Результат операции
   */
  updateTask(projectId: string, taskId: string, updatedTask: any): boolean {
    return JsonStorage.updateItem(
      STORAGE_KEYS.PROJECTS,
      (projects: any[]) => projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task: any) => 
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
   * @param {Object} newTask - Новая задача
   * @returns {boolean} Результат операции
   */
  addTask(projectId: string, newTask: any): boolean {
    return JsonStorage.updateItem(
      STORAGE_KEYS.PROJECTS,
      (projects: any[]) => projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
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
    return JsonStorage.updateItem(
      STORAGE_KEYS.PROJECTS,
      (projects: any[]) => projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter((task: any) => task.id !== taskId)
          };
        }
        return project;
      }),
      []
    );
  }
};

/**
 * Инициализация и диагностика хранилища
 */
export const StorageInit = {
  /**
   * Инициализирует хранилище проектов, если оно пустое
   * @returns {boolean} Результат операции
   */
  initializeProjectsStorage(): boolean {
    if (!StorageCore.getRawItem(STORAGE_KEYS.PROJECTS)) {
      return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
    }
    return true;
  },

  /**
   * Проверяет валидность данных проектов и исправляет при необходимости
   * @returns {boolean} True если данные валидны или исправлены
   */
  validateProjectsStorage(): boolean {
    try {
      const raw = StorageCore.getRawItem(STORAGE_KEYS.PROJECTS);
      
      // Если данных нет, создаем пустой массив
      if (!raw) {
        return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
      }
      
      // Проверяем, что данные - валидный JSON
      const parsed = JSON.parse(raw);
      
      // Проверяем, что данные - массив
      if (!Array.isArray(parsed)) {
        console.error("Данные проектов не являются массивом, сбрасываем");
        return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
      }
      
      return true;
    } catch (error) {
      console.error("Ошибка при валидации данных проектов:", error);
      return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
    }
  },

  /**
   * Создает тестовый проект для отладки
   * @returns {boolean} Результат операции
   */
  createSampleProject(): boolean {
    const testProject = {
      id: crypto.randomUUID(),
      name: 'Тестовый проект',
      description: 'Проект для проверки работы приложения',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [
        {
          id: crypto.randomUUID(),
          name: 'Тестовая задача',
          description: 'Описание тестовой задачи',
          price: 5000,
          estimatedTime: 8,
          progress: 50,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: null
        }
      ]
    };
    
    return ProjectStorage.addProject(testProject);
  }
};

/**
 * Сервис для управления сессиями пользователей
 */
export const SessionStorage = {
  /**
   * Сохраняет сообщение об ошибке аутентификации
   * @param {string} message - Сообщение для сохранения
   */
  saveAuthMessage(message: string): void {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_MESSAGE, message);
  },

  /**
   * Получает и удаляет сообщение об ошибке аутентификации
   * @returns {string|null} Сообщение или null
   */
  getAuthErrorMessage(): string | null {
    const message = sessionStorage.getItem(STORAGE_KEYS.AUTH_MESSAGE);
    if (message) {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_MESSAGE);
    }
    return message;
  },

  /**
   * Сохраняет данные пользовательской сессии
   * @param {Object} sessionData - Данные сессии
   * @returns {boolean} Результат операции
   */
  saveUserSession(sessionData: any): boolean {
    return JsonStorage.setItem(STORAGE_KEYS.SESSION, sessionData);
  },

  /**
   * Получает данные текущей сессии
   * @returns {Object|null} Данные сессии или null
   */
  getUserSession(): any | null {
    return JsonStorage.getItem(STORAGE_KEYS.SESSION, null);
  },

  /**
   * Удаляет текущую сессию
   * @returns {boolean} Результат операции
   */
  clearUserSession(): boolean {
    return StorageCore.removeItem(STORAGE_KEYS.SESSION);
  }
};

/**
 * Основной экспортируемый объект утилит хранилища
 */
const storageUtils = {
  core: StorageCore,
  json: JsonStorage,
  projects: ProjectStorage,
  tasks: TaskStorage,
  init: StorageInit,
  session: SessionStorage,
  
  /**
   * Получает проекты из хранилища
   * @returns {Array} Массив проектов
   */
  getProjectsFromStorage() {
    return ProjectStorage.getProjects();
  },

  /**
   * Сохраняет проекты в хранилище
   * @param {Array} projects - Проекты для сохранения
   * @returns {boolean} Результат операции
   */
  saveProjectsToStorage(projects: any[]) {
    return ProjectStorage.saveProjects(projects);
  },

  /**
   * Инициализирует хранилище с начальными данными
   */
  initializeProjectsStorage() {
    StorageInit.initializeProjectsStorage();
    StorageInit.validateProjectsStorage();
  },

  /**
   * Удаляет информацию о пользователе из хранилища
   */
  removeUserFromStorage() {
    StorageCore.removeItem(STORAGE_KEYS.SESSION);
  },

  /**
   * Сохраняет сообщение для страницы входа
   * @param {string} message - Сообщение
   */
  saveLoginMessage(message: string | null) {
    if (message) {
      SessionStorage.saveAuthMessage(message);
    }
  },

  /**
   * Получает сообщение об ошибке аутентификации
   * @returns {string|null} Сообщение или null
   */
  getAuthErrorMessage() {
    return SessionStorage.getAuthErrorMessage();
  },

  /**
   * Тестирует доступность localStorage
   * @returns {boolean} True если хранилище доступно
   */
  testStorageAvailability() {
    return StorageCore.isAvailable();
  },

  /**
   * Сбрасывает все данные проектов
   * @returns {boolean} Результат операции
   */
  resetProjectsStorage() {
    return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
  }
};

export default storageUtils;
