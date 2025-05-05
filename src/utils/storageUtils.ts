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
  console.log("Raw projects from storage:", projectsStr);
  
  if (!projectsStr) {
    console.log("No projects in storage, initializing empty array");
    const emptyProjects = [];
    localStorage.setItem('projects', JSON.stringify(emptyProjects));
    return emptyProjects;
  }

  try {
    const parsedProjects = JSON.parse(projectsStr);
    if (!Array.isArray(parsedProjects)) {
      console.error("Projects data is not an array, resetting to empty array");
      const emptyProjects = [];
      localStorage.setItem('projects', JSON.stringify(emptyProjects));
      return emptyProjects;
    }
    return parsedProjects;
  } catch (error) {
    console.error("Failed to parse projects data:", error);
    const emptyProjects = [];
    localStorage.setItem('projects', JSON.stringify(emptyProjects));
    return emptyProjects;
  }
};

/**
 * Сохраняет проекты в localStorage
 */
export const saveProjectsToStorage = (projects) => {
  try {
    if (!Array.isArray(projects)) {
      console.error("Trying to save non-array projects data:", projects);
      return false;
    }
    
    const projectsJson = JSON.stringify(projects);
    localStorage.setItem('projects', projectsJson);
    
    // Проверка сохранения
    const savedData = localStorage.getItem('projects');
    if (savedData !== projectsJson) {
      console.error("Storage verification failed - data mismatch");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error saving projects to storage:", error);
    return false;
  }
};

/**
 * Удаляет информацию о пользователе из localStorage
 */
export const removeUserFromStorage = () => {
  localStorage.removeItem('user');
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
 * Получает сообщение об ошибке аутентификации и удаляет его из sessionStorage
 */
export const getAuthErrorMessage = () => {
  const message = sessionStorage.getItem('auth_message');
  if (message) {
    sessionStorage.removeItem('auth_message');
  }
  return message;
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
    console.error('Локальное хранилище не доступно:', e);
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

/**
 * Создает новый массив проектов в localStorage, если его нет
 */
export const initializeProjectsStorage = () => {
  try {
    const existingProjects = localStorage.getItem('projects');
    if (!existingProjects) {
      console.log("Initializing projects storage with empty array");
      localStorage.setItem('projects', JSON.stringify([]));
    } else {
      try {
        // Проверяем валидность JSON
        const parsed = JSON.parse(existingProjects);
        if (!Array.isArray(parsed)) {
          console.error("Existing projects data is not an array, reinitializing");
          localStorage.setItem('projects', JSON.stringify([]));
        }
      } catch (e) {
        console.error("Failed to parse existing projects, reinitializing:", e);
        localStorage.setItem('projects', JSON.stringify([]));
      }
    }
    return true;
  } catch (error) {
    console.error("Error initializing projects storage:", error);
    return false;
  }
};