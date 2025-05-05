
/**
 * @file Обертка для сохранения обратной совместимости
 * @deprecated Используйте импорты из 'src/utils/storage' вместо этого файла
 */

// Реэкспортируем все из нового модуля для обратной совместимости
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
} from './storage';

// Экспортируем именованные функции для обратной совместимости
export {
  createSampleProject,
  getProjectsFromStorage,
  saveProjectsToStorage,
  initializeProjectsStorage,
  testStorageAvailability,
  resetProjectsStorage
};

// Экспортируем по умолчанию объект с функциями для обратной совместимости
export default {
  getProjectsFromStorage,
  saveProjectsToStorage,
  initializeProjectsStorage,
  createSampleProject,
  testStorageAvailability,
  resetProjectsStorage,
  removeUserFromStorage,
  saveLoginMessage,
  getAuthErrorMessage
};
