
/**
 * Сервис для работы с локальным хранилищем
 */
export const StorageService = {
  /**
   * Получает данные из хранилища
   */
  getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const dataStr = localStorage.getItem(key);
      if (!dataStr) return defaultValue;
      
      const data = JSON.parse(dataStr);
      return data;
    } catch (error) {
      console.error(`Ошибка при получении ${key} из хранилища:`, error);
      return defaultValue;
    }
  },

  /**
   * Сохраняет данные в хранилище
   */
  saveToStorage<T>(key: string, data: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении ${key} в хранилище:`, error);
      return false;
    }
  },

  /**
   * Удаляет данные из хранилища
   */
  removeFromStorage(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении ${key} из хранилища:`, error);
      return false;
    }
  },

  /**
   * Проверяет доступность хранилища
   */
  isStorageAvailable(): boolean {
    try {
      const testKey = "_test_storage_";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Инициализирует хранилище с начальными данными
   */
  initializeStorage<T>(key: string, defaultValue: T): void {
    try {
      const existingData = localStorage.getItem(key);
      if (!existingData) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch (error) {
      console.error(`Ошибка при инициализации ${key} в хранилище:`, error);
    }
  }
};
