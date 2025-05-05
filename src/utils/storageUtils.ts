
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
