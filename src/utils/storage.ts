
/**
 * Утилиты для работы с локальным хранилищем
 * @deprecated Используйте импорты из 'src/utils/storage/index' вместо этого файла
 */
import storageAPI, {
  createSampleProject,
  getProjectsFromStorage,
  saveProjectsToStorage,
  initializeProjectsStorage,
  testStorageAvailability,
  resetProjectsStorage,
  removeUserFromStorage,
  saveLoginMessage,
  getAuthErrorMessage
} from './storage/index';

import { Project, Task } from '@/types/project';

/**
 * Проверяет доступность хранилища
 * @returns true, если хранилище доступно
 */
export function testStorageAvailability(): boolean {
  return storageAPI.testStorageAvailability();
}

/**
 * Получает проекты из хранилища
 * @returns Массив проектов или пустой массив
 */
export function getProjectsFromStorage(): Project[] {
  return storageAPI.getProjectsFromStorage();
}

/**
 * Сохраняет проекты в хранилище
 * @param projects - Проекты для сохранения
 * @returns true в случае успешного сохранения
 */
export function saveProjectsToStorage(projects: Project[]): boolean {
  return storageAPI.saveProjectsToStorage(projects);
}

/**
 * Инициализирует хранилище проектов
 */
export function initializeProjectsStorage(): void {
  storageAPI.initializeProjectsStorage();
}

/**
 * Сбрасывает хранилище проектов к пустому массиву
 * @returns true в случае успешного сброса
 */
export function resetProjectsStorage(): boolean {
  return storageAPI.resetProjectsStorage();
}

/**
 * Создает тестовый проект для отладки
 * @returns true в случае успешного создания
 */
export function createSampleProject(): boolean {
  return storageAPI.createSampleProject();
}

/**
 * Удаляет информацию о пользователе из хранилища
 * @returns true в случае успешного удаления
 */
export function removeUserFromStorage(): boolean {
  return storageAPI.removeUserFromStorage();
}

/**
 * Сохраняет сообщение для страницы входа
 * @param message - Сообщение для сохранения
 */
export function saveLoginMessage(message: string | null): void {
  storageAPI.saveLoginMessage(message);
}

/**
 * Получает и удаляет сообщение об ошибке аутентификации
 * @returns Сообщение об ошибке или null
 */
export function getAuthErrorMessage(): string | null {
  return storageAPI.getAuthErrorMessage();
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
