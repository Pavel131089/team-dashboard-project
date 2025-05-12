/**
 * Утилиты для работы с JSON данными в хранилище
 * @module storage/json
 */

import StorageCore from './core';

/**
 * Модуль для работы с JSON-данными в localStorage
 * Обеспечивает типобезопасность и обработку ошибок
 */
export const JsonStorage = {
  /**
   * Получает и парсит JSON данные из localStorage
   * @param {string} key - Ключ для чтения
   * @param {T} defaultValue - Значение по умолчанию
   * @returns {T} Распарсенные данные или значение по умолчанию
   * @template T - Тип данных для хранения
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
   * @template T - Тип данных для хранения
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
   * @template T - Тип данных для хранения
   */
  updateItem<T>(key: string, updateFn: (data: T) => T, defaultValue: T): boolean {
    const currentData = this.getItem<T>(key, defaultValue);
    const updatedData = updateFn(currentData);
    return this.setItem(key, updatedData);
  }
};

export default JsonStorage;