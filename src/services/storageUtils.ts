/**
 * Консистентное преобразование из JSON
 * @param jsonStr JSON строка
 * @param defaultValue Значение по умолчанию
 * @returns Распарсенный объект или defaultValue
 */
export function safeParseJSON<T>(jsonStr: string | null, defaultValue: T): T {
  if (!jsonStr) return defaultValue;

  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}

/**
 * Получает проекты из хранилища с безопасным парсингом
 * @returns массив проектов с гарантированными датами
 */
export function getProjectsFromStorage(): Project[] {
  try {
    // Получаем JSON строку из localStorage
    const projectsStr = localStorage.getItem("projects");

    // Безопасно парсим JSON
    const projects = safeParseJSON<Project[]>(projectsStr, []);

    // Гарантируем, что все проекты имеют даты
    return projects.map((project) => {
      // Создаем даты проекта, если их нет
      const updatedProject = {
        ...project,
        startDate: project.startDate || new Date().toISOString(),
        endDate:
          project.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Обновляем даты задач, если нужно
      if (Array.isArray(project.tasks)) {
        updatedProject.tasks = project.tasks.map((task) => ({
          ...task,
          startDate: task.startDate || updatedProject.startDate,
          endDate: task.endDate || updatedProject.endDate,
        }));
      }

      return updatedProject;
    });
  } catch (error) {
    console.error("Ошибка получения проектов из localStorage:", error);
    return [];
  }
}

/**
 * Утилиты для работы с локальным хранилищем
 */
export const storageUtils = {
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
      console.error(
        `Ошибка при получении данных из хранилища (${key}):`,
        error,
      );
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
      console.error(
        `Ошибка при сохранении данных в хранилища (${key}):`,
        error,
      );
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
  },
};

export default storageUtils;
