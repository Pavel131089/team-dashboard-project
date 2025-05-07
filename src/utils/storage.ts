
import { Project, Task } from "@/types/project";

/**
 * Централизованное API для работы с хранилищем
 */

/**
 * Проверяет доступность хранилища
 * @returns true, если хранилище доступно
 */
export function testStorageAvailability(): boolean {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Получает проекты из хранилища
 * @returns Массив проектов или пустой массив
 */
export function getProjectsFromStorage(): Project[] {
  try {
    const projectsStr = localStorage.getItem('projects');
    if (!projectsStr) return [];
    return JSON.parse(projectsStr);
  } catch (error) {
    console.error("Ошибка при получении проектов:", error);
    return [];
  }
}

/**
 * Сохраняет проекты в хранилище
 * @param projects - Проекты для сохранения
 * @returns true в случае успешного сохранения
 */
export function saveProjectsToStorage(projects: Project[]): boolean {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error("Ошибка при сохранении проектов:", error);
    return false;
  }
}

/**
 * Инициализирует хранилище проектов
 */
export function initializeProjectsStorage(): void {
  try {
    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify([]));
    }
    
    // Проверка валидности данных проектов
    validateProjectsStorage();
  } catch (error) {
    console.error("Ошибка при инициализации хранилища проектов:", error);
  }
}

/**
 * Проверяет и исправляет валидность данных проектов
 */
function validateProjectsStorage(): void {
  try {
    const projectsStr = localStorage.getItem('projects');
    if (!projectsStr) return;
    
    const projects = JSON.parse(projectsStr);
    if (!Array.isArray(projects)) {
      console.error("Данные проектов не являются массивом, сбрасываем");
      localStorage.setItem('projects', JSON.stringify([]));
    }
  } catch (error) {
    console.error("Ошибка при валидации проектов:", error);
    localStorage.setItem('projects', JSON.stringify([]));
  }
}

/**
 * Сбрасывает хранилище проектов к пустому массиву
 * @returns true в случае успешного сброса
 */
export function resetProjectsStorage(): boolean {
  try {
    localStorage.setItem('projects', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error("Ошибка при сбросе хранилища проектов:", error);
    return false;
  }
}

/**
 * Создает тестовый проект для отладки
 * @returns true в случае успешного создания
 */
export function createSampleProject(): boolean {
  try {
    const projects = getProjectsFromStorage();
    
    const testProject: Project = {
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
    
    projects.push(testProject);
    return saveProjectsToStorage(projects);
  } catch (error) {
    console.error("Ошибка при создании тестового проекта:", error);
    return false;
  }
}

/**
 * Удаляет информацию о пользователе из хранилища
 * @returns true в случае успешного удаления
 */
export function removeUserFromStorage(): boolean {
  try {
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error("Ошибка при удалении пользователя из хранилища:", error);
    return false;
  }
}

/**
 * Сохраняет сообщение для страницы входа
 * @param message - Сообщение для сохранения
 */
export function saveLoginMessage(message: string | null): void {
  if (message) {
    sessionStorage.setItem('auth_message', message);
  }
}

/**
 * Получает и удаляет сообщение об ошибке аутентификации
 * @returns Сообщение об ошибке или null
 */
export function getAuthErrorMessage(): string | null {
  try {
    const message = sessionStorage.getItem('auth_message');
    if (message) {
      sessionStorage.removeItem('auth_message');
    }
    return message;
  } catch (error) {
    console.error("Ошибка при получении сообщения об ошибке:", error);
    return null;
  }
}

// Объект с функциями для удобного импорта
export const storageUtils = {
  testStorageAvailability,
  getProjectsFromStorage,
  saveProjectsToStorage,
  initializeProjectsStorage,
  resetProjectsStorage,
  createSampleProject,
  removeUserFromStorage,
  saveLoginMessage,
  getAuthErrorMessage,
  
  /**
   * Получает данные из хранилища с типизацией
   * @param key - Ключ в хранилище
   * @param defaultValue - Значение по умолчанию
   * @returns Данные из хранилища или defaultValue
   */
  getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const dataStr = localStorage.getItem(key);
      if (!dataStr) return defaultValue;
      return JSON.parse(dataStr) as T;
    } catch (error) {
      console.error(`Ошибка при получении данных из хранилища (${key}):`, error);
      return defaultValue;
    }
  },
  
  /**
   * Сохраняет данные в хранилище
   * @param key - Ключ в хранилище
   * @param data - Данные для сохранения
   * @returns true в случае успешного сохранения
   */
  saveToStorage<T>(key: string, data: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении данных в хранилище (${key}):`, error);
      return false;
    }
  },
  
  /**
   * Инициализирует хранилище с начальными данными
   * @param key - Ключ в хранилище
   * @param defaultValue - Начальное значение
   */
  initializeStorage<T>(key: string, defaultValue: T): void {
    try {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch (error) {
      console.error(`Ошибка при инициализации хранилища (${key}):`, error);
    }
  }
};

export default storageUtils;
