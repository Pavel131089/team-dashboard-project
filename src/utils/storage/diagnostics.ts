
/**
 * Инициализация и диагностика хранилища
 * @module storage/diagnostics
 */

import StorageCore from './core';
import JsonStorage from './json';
import ProjectStorage from './projects';
import STORAGE_KEYS from './keys';
import type { Project, Task } from './projects';

/**
 * Модуль для инициализации, тестирования и диагностики хранилища
 */
export const StorageDiagnostics = {
  /**
   * Инициализирует хранилище проектов, если оно пустое
   * @returns {boolean} Результат операции
   */
  initializeProjectsStorage(): boolean {
    if (!StorageCore.getRawItem(STORAGE_KEYS.PROJECTS)) {
      return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
    }
    return true;
  },

  /**
   * Проверяет валидность данных проектов и исправляет при необходимости
   * @returns {boolean} True если данные валидны или исправлены
   */
  validateProjectsStorage(): boolean {
    try {
      const raw = StorageCore.getRawItem(STORAGE_KEYS.PROJECTS);
      
      // Если данных нет, создаем пустой массив
      if (!raw) {
        return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
      }
      
      // Проверяем, что данные - валидный JSON
      const parsed = JSON.parse(raw);
      
      // Проверяем, что данные - массив
      if (!Array.isArray(parsed)) {
        console.error("Данные проектов не являются массивом, сбрасываем");
        return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
      }
      
      return true;
    } catch (error) {
      console.error("Ошибка при валидации данных проектов:", error);
      return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
    }
  },

  /**
   * Создает тестовый проект для отладки
   * @returns {boolean} Результат операции
   */
  createSampleProject(): boolean {
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
    
    return ProjectStorage.addProject(testProject);
  },
  
  /**
   * Тестирует доступность localStorage
   * @returns {boolean} True если хранилище доступно
   */
  testStorageAvailability(): boolean {
    return StorageCore.isAvailable();
  },

  /**
   * Сбрасывает все данные проектов
   * @returns {boolean} Результат операции
   */
  resetProjectsStorage(): boolean {
    return JsonStorage.setItem(STORAGE_KEYS.PROJECTS, []);
  }
};

export default StorageDiagnostics;
