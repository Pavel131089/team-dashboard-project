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
      // Детектирование режима приватного просмотра в Safari
      if (typeof localStorage === "undefined") {
        return false;
      }

      const testKey = "__storage_test__";
      localStorage.setItem(testKey, testKey);
      const result = localStorage.getItem(testKey) === testKey;
      localStorage.removeItem(testKey);
      return result;
    } catch (e) {
      console.error("Локальное хранилище не доступно:", e);
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
      if (!this.isAvailable()) {
        console.warn("localStorage недоступен, возвращаем null");
        return null;
      }
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
      if (!this.isAvailable()) {
        console.warn("localStorage недоступен, данные не сохранены");
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Ошибка при записи в хранилище (${key}):`, error);

      // Проверяем на ошибку квоты (обычно в мобильных Safari)
      if (
        error instanceof DOMException &&
        (error.code === 22 || // Chrome
          error.code === 1014 || // Firefox
          error.name === "QuotaExceededError" || // Safari
          error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        // Firefox
        console.warn("Превышен лимит хранилища. Попытка очистки кэша...");

        // Пытаемся очистить ненужные данные
        try {
          localStorage.removeItem("__temp_cache__");
        } catch (e) {
          console.error("Не удалось очистить кэш:", e);
        }
      }

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
      if (!this.isAvailable()) {
        console.warn("localStorage недоступен, данные не удалены");
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении из хранилища (${key}):`, error);
      return false;
    }
  },
};

export default StorageCore;
