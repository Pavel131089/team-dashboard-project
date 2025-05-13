
/**
 * Утилиты для работы с локальным хранилищем
 */
export const storageUtils = {
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
