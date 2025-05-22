import { Project } from "@/types/project";

/**
 * Получает проекты из localStorage
 * @returns массив проектов
 */
export function getProjectsFromStorage(): Project[] {
  try {
    const storedProjects = localStorage.getItem("projects");
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error("Ошибка получения проектов из localStorage:", error);
    return [];
  }
}

/**
 * Сохраняет проекты в localStorage
 * @param projects массив проектов для сохранения
 */
export function saveProjectsToStorage(projects: Project[]): void {
  try {
    localStorage.setItem("projects", JSON.stringify(projects));
  } catch (error) {
    console.error("Ошибка сохранения проектов в localStorage:", error);
  }
}

/**
 * Инициализирует хранилище проектов, если оно пусто
 */
export function initializeProjectsStorage(): void {
  try {
    const projects = getProjectsFromStorage();

    if (projects.length === 0) {
      // Создаем несколько демо-проектов
      const demoProjects: Project[] = [
        {
          id: "project-1",
          name: "Веб-сайт компании",
          description: "Разработка корпоративного веб-сайта",
          createdAt: new Date().toISOString(),
          createdBy: "default-manager",
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tasks: [
            {
              id: "task-1",
              name: "Дизайн главной страницы",
              description: "Создание дизайна главной страницы сайта",
              price: 10000,
              estimatedTime: 16,
              startDate: new Date().toISOString(),
              endDate: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              assignedTo: "",
              assignedToNames: [],
              progress: 0,
            },
            {
              id: "task-2",
              name: "Вёрстка главной страницы",
              description: "HTML/CSS вёрстка по готовому дизайну",
              price: 7000,
              estimatedTime: 12,
              startDate: new Date(
                Date.now() + 6 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              endDate: new Date(
                Date.now() + 10 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              assignedTo: "",
              assignedToNames: [],
              progress: 0,
            },
          ],
        },
        {
          id: "project-2",
          name: "Мобильное приложение",
          description: "Разработка мобильного приложения для iOS и Android",
          createdAt: new Date().toISOString(),
          createdBy: "default-manager",
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          tasks: [
            {
              id: "task-3",
              name: "Прототип интерфейса",
              description: "Создание прототипа интерфейса в Figma",
              price: 15000,
              estimatedTime: 24,
              startDate: new Date().toISOString(),
              endDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              assignedTo: "",
              assignedToNames: [],
              progress: 0,
            },
          ],
        },
      ];

      saveProjectsToStorage(demoProjects);
    }
  } catch (error) {
    console.error("Ошибка инициализации хранилища проектов:", error);
  }
}

/**
 * Тестирует доступность localStorage
 * @returns true если хранилище доступно
 */
export function testStorageAvailability(): boolean {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Создает тестовый проект
 * @returns true в случае успеха
 */
export function createSampleProject(): boolean {
  try {
    const projects = getProjectsFromStorage();

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: "Тестовый проект",
      description: "Автоматически созданный тестовый проект",
      createdAt: new Date().toISOString(),
      createdBy: "default-manager",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      tasks: [
        {
          id: `task-${Date.now()}`,
          name: "Тестовая задача",
          description: "Описание тестовой задачи",
          price: 5000,
          estimatedTime: 8,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: "",
          assignedToNames: [],
          progress: 0,
        },
      ],
    };

    saveProjectsToStorage([...projects, newProject]);
    return true;
  } catch (error) {
    console.error("Ошибка создания тестового проекта:", error);
    return false;
  }
}

/**
 * Сбрасывает все данные проектов
 * @returns true в случае успеха
 */
export function resetProjectsStorage(): boolean {
  try {
    saveProjectsToStorage([]);
    return true;
  } catch (error) {
    console.error("Ошибка при сбросе проектов:", error);
    return false;
  }
}
