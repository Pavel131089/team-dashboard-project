
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
  }
};
