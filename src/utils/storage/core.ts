
/**
 * Базовые низкоуровневые операции с локальным хранилищем
 * @module storage/core
 */

/**
 * Базовый слой для работы с localStorage
 * Обрабатывает ошибки и предоставляет низкоуровневый API
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

export default StorageCore;
