
/**
 * Централизованный API для работы с хранилищем
 * @module storage
 */

// Импортируем все подмодули
import StorageCore from './core';
import JsonStorage from './json';
import ProjectStorage from './projects';
import SessionStorage from './session';
import StorageDiagnostics from './diagnostics';
import STORAGE_KEYS from './keys';

// Экспортируем типы
export type { Project, Task } from './projects';
export type { SessionData } from './session';

/**
 * Создает тестовый проект для отладки
 * @returns {boolean} Результат операции
 */
export function createSampleProject(): boolean {
  return StorageDiagnostics.createSampleProject();
}

/**
 * Получает проекты из хранилища
 * @returns {Project[]} Массив проектов
 */
export function getProjectsFromStorage(): any[] {
  return ProjectStorage.getProjects();
}

/**
 * Сохраняет проекты в хранилище
 * @param {Project[]} projects - Проекты для сохранения
 * @returns {boolean} Результат операции
 */
export function saveProjectsToStorage(projects: any[]): boolean {
  return ProjectStorage.saveProjects(projects);
}

/**
 * Инициализирует хранилище с начальными данными
 */
export function initializeProjectsStorage(): void {
  StorageDiagnostics.initializeProjectsStorage();
  StorageDiagnostics.validateProjectsStorage();
}

/**
 * Тестирует доступность localStorage
 * @returns {boolean} True если хранилище доступно
 */
export function testStorageAvailability(): boolean {
  return StorageDiagnostics.testStorageAvailability();
}

/**
 * Сбрасывает все данные проектов
 * @returns {boolean} Результат операции
 */
export function resetProjectsStorage(): boolean {
  return StorageDiagnostics.resetProjectsStorage();
}

/**
 * Удаляет информацию о пользователе из хранилища
 */
export function removeUserFromStorage(): boolean {
  return SessionStorage.clearUserSession();
}

/**
 * Сохраняет сообщение для страницы входа
 * @param {string} message - Сообщение
 */
export function saveLoginMessage(message: string | null): void {
  if (message) {
    SessionStorage.saveAuthMessage(message);
  }
}

/**
 * Получает сообщение об ошибке аутентификации
 * @returns {string|null} Сообщение или null
 */
export function getAuthErrorMessage(): string | null {
  return SessionStorage.getAuthErrorMessage();
}

// Экспортируем API для доступа к подмодулям
const storageAPI = {
  // Публичные функции
  createSampleProject,
  getProjectsFromStorage,
  saveProjectsToStorage,
  initializeProjectsStorage,
  testStorageAvailability,
  resetProjectsStorage,
  removeUserFromStorage,
  saveLoginMessage,
  getAuthErrorMessage,
  
  // Модули для расширенной функциональности
  core: StorageCore,
  json: JsonStorage,
  projects: ProjectStorage,
  session: SessionStorage,
  diagnostics: StorageDiagnostics,
  keys: STORAGE_KEYS
};

export default storageAPI;
