]/storageUtils.js"]

/**
 * Утилиты для работы с localStorage
 */

/**
 * Получает данные пользователя из localStorage
 */
export const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

/**
 * Получает проекты из localStorage
 */
export const getProjectsFromStorage = () => {
  const projectsStr = localStorage.getItem('projects');
  if (!projectsStr) return [];

  try {
    return JSON.parse(projectsStr);
  } catch (error) {
    console.error("Failed to parse projects data:", error);
    return [];
  }
};

/**
 * Сохраняет проекты в localStorage
 */
export const saveProjectsToStorage = (projects) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

/**
 * Удаляет информацию о пользователе из localStorage
 */
export const removeUserFromStorage = () => {
  localStorage.removeItem('user');
};

/**
 * Создает новый массив проектов в localStorage, если его нет
 */
export const initializeProjectsStorage = () => {
  if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify([]));
  }
};

/**
 * Сохраняет сообщение для страницы входа
 */
export const saveLoginMessage = (message) => {
  if (message) {
    sessionStorage.setItem('auth_message', message);
  }
};

/**
 * Тестирует доступность localStorage
 */
export const testStorageAvailability = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    const result = localStorage.getItem(test);
    localStorage.removeItem(test);
    return result === test;
  } catch (e) {
    console.error('LocalStorage не доступен:', e);
    return false;
  }
};

/**
 * Создает тестовый проект для проверки
 */
export const createSampleProject = () => {
  const testProject = {
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
  
  try {
    // Получаем существующие проекты
    const existingProjects = getProjectsFromStorage();
    
    // Добавляем тестовый проект
    const updatedProjects = [...existingProjects, testProject];
    
    // Сохраняем обновленный список
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    return true;
  } catch (error) {
    console.error('Ошибка при создании тестового проекта:', error);
    return false;
  }
};

/**
 * Сбрасывает все данные проектов
 */
export const resetProjectsStorage = () => {
  try {
    localStorage.setItem('projects', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Ошибка при сбросе данных проектов:', error);
    return false;
  }
};