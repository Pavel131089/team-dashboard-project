/**
 * Утилиты для работы с локальным хранилищем
 */
export const storageUtils = {
  /**
   * Получает данные из хранилища
   * 
   * @param key - Ключ хранилища
   * @param defaultValue - Значение по умолчанию
   * @returns Данные из хранилища или значение по умолчанию
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
   * 
   * @param key - Ключ хранилища
   * @param data - Данные для сохранения
   * @returns true в случае успеха, false в случае ошибки
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
   * Удаляет данные из хранилища
   * 
   * @param key - Ключ хранилища
   * @returns true в случае успеха, false в случае ошибки
   */
  removeFromStorage(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении данных из хранилища (${key}):`, error);
      return false;
    }
  },
  
  /**
   * Проверяет доступность хранилища
   * 
   * @returns true, если хранилище доступно
   */
  isStorageAvailable(): boolean {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Инициализирует хранилище, если оно не существует
   * 
   * @param key - Ключ хранилища
   * @param defaultValue - Начальное значение
   */
  initializeStorage<T>(key: string, defaultValue: T): void {
    try {
      // Проверяем, существует ли хранилище
      const exists = localStorage.getItem(key) !== null;
      
      // Если не существует, инициализируем
      if (!exists) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch (error) {
      console.error(`Ошибка при инициализации хранилища (${key}):`, error);
    }
  },

  /**
   * Создает тестовый проект для отладки
   * @returns {boolean} Успешность операции
   */
  createSampleProject(): boolean {
    try {
      // Получаем текущий список проектов
      const projects = this.getFromStorage('projects', []);
      
      // Создаем тестовый проект
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
      
      // Добавляем проект в список
      projects.push(testProject);
      
      // Сохраняем обновленный список
      return this.saveToStorage('projects', projects);
    } catch (error) {
      console.error("Ошибка при создании тестового проекта:", error);
      return false;
    }
  }
};

// Экспортируем отдельные функции для совместимости
export function createSampleProject(): boolean {
  return storageUtils.createSampleProject();
}

export function getProjectsFromStorage(): any[] {
  return storageUtils.getFromStorage('projects', []);
}

export function saveProjectsToStorage(projects: any[]): boolean {
  return storageUtils.saveToStorage('projects', projects);
}

export function initializeProjectsStorage(): void {
  storageUtils.initializeStorage('projects', []);
}

export function testStorageAvailability(): boolean {
  return storageUtils.isStorageAvailable();
}

export function resetProjectsStorage(): boolean {
  return storageUtils.saveToStorage('projects', []);
}

// Экспортируем по умолчанию объект с функциями
export default storageUtils;
