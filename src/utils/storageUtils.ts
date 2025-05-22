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
    // Текущая дата и даты с диапазоном для демо-проектов
    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);

    // Создаем несколько демо-проектов с явно указанными датами
    const demoProjects = [
      {
        id: "project-1",
        name: "Веб-сайт компании",
        description: "Разработка корпоративного веб-сайта",
        createdAt: currentDate.toISOString(),
        createdBy: "default-manager",
        startDate: currentDate.toISOString(),
        endDate: oneMonthLater.toISOString(),
        tasks: [
          {
            id: "task-1",
            name: "Дизайн главной страницы",
            description: "Создание дизайна главной страницы сайта",
            price: 10000,
            estimatedTime: 16,
            startDate: currentDate.toISOString(),
            endDate: new Date(
              currentDate.getTime() + 5 * 24 * 60 * 60 * 1000,
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
              currentDate.getTime() + 6 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            endDate: new Date(
              currentDate.getTime() + 10 * 24 * 60 * 60 * 1000,
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
        createdAt: currentDate.toISOString(),
        createdBy: "default-manager",
        startDate: currentDate.toISOString(),
        endDate: new Date(
          currentDate.getTime() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        tasks: [
          {
            id: "task-3",
            name: "Прототип интерфейса",
            description: "Создание прототипа интерфейса в Figma",
            price: 15000,
            estimatedTime: 24,
            startDate: currentDate.toISOString(),
            endDate: new Date(
              currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            assignedTo: "",
            assignedToNames: [],
            progress: 0,
          },
        ],
      },
    ];

    // Сохраняем демо-проекты в хранилище
    localStorage.setItem("projects", JSON.stringify(demoProjects));
    console.log("Инициализировано хранилище с демо-проектами", demoProjects);
  } catch (error) {
    console.error("Ошибка при инициализации хранилища проектов:", error);
    // В случае ошибки создаем пустой массив проектов
    localStorage.setItem("projects", JSON.stringify([]));
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

    // Создаем даты для проекта
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14); // Проект на 2 недели

    // Создаем даты для задачи
    const taskStartDate = new Date();
    const taskEndDate = new Date();
    taskEndDate.setDate(taskStartDate.getDate() + 7); // Задача на 1 неделю

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: "Тестовый проект",
      description: "Автоматически созданный тестовый проект",
      createdAt: new Date().toISOString(),
      createdBy: "default-manager",
      startDate: startDate.toISOString(), // Явно задаем дату начала
      endDate: endDate.toISOString(), // Явно задаем дату окончания
      tasks: [
        {
          id: `task-${Date.now()}`,
          name: "Тестовая задача",
          description: "Описание тестовой задачи",
          price: 5000,
          estimatedTime: 8,
          startDate: taskStartDate.toISOString(), // Явно задаем дату начала задачи
          endDate: taskEndDate.toISOString(), // Явно задаем дату окончания задачи
          assignedTo: "",
          assignedToNames: [],
          progress: 0,
        },
      ],
    };

    saveProjectsToStorage([...projects, newProject]);
    console.log("Создан тестовый проект", newProject);
    return true;
  } catch (error) {
    console.error("Ошибка создания тестового проекта:", error);
    return false;
  }
}

/**
 * Исправляет отсутствующие даты проектов и задач в хранилище
 * @returns true в случае успеха
 */
export function fixProjectDates(): boolean {
  try {
    // Получаем проекты из хранилища
    const projectsStr = localStorage.getItem("projects");
    if (!projectsStr) {
      console.warn("No projects found in storage, initializing with test data");
      initializeProjectsStorage();
      return true;
    }

    // Парсим проекты
    let projects;
    try {
      projects = JSON.parse(projectsStr);
      if (!Array.isArray(projects)) {
        console.error(
          "Projects data is not an array, initializing with test data",
        );
        initializeProjectsStorage();
        return true;
      }
    } catch (error) {
      console.error(
        "Error parsing projects data, initializing with test data",
        error,
      );
      initializeProjectsStorage();
      return true;
    }

    let hasChanges = false;

    // Обновляем даты проектов и задач
    const updatedProjects = projects.map((project) => {
      // Проверяем даты проекта
      if (!project.startDate || !project.endDate) {
        hasChanges = true;
        console.log(
          `Adding missing dates to project ${project.name || project.id}`,
        );
        project.startDate = project.startDate || new Date().toISOString();
        project.endDate =
          project.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Проверяем задачи проекта
      if (Array.isArray(project.tasks)) {
        project.tasks = project.tasks.map((task) => {
          if (!task.startDate || !task.endDate) {
            hasChanges = true;
            console.log(`Adding missing dates to task ${task.name || task.id}`);
            return {
              ...task,
              startDate: task.startDate || project.startDate,
              endDate: task.endDate || project.endDate,
            };
          }
          return task;
        });
      } else {
        hasChanges = true;
        console.log(
          `Project ${project.name || project.id} has no tasks, adding empty array`,
        );
        project.tasks = [];
      }

      return project;
    });

    // Сохраняем обновленные проекты, если были изменения
    if (hasChanges) {
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      console.log("Projects updated with fixed dates");
    } else {
      console.log("No date fixes needed for projects");
    }

    return true;
  } catch (error) {
    console.error("Error fixing project dates:", error);
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
    console.log("Проекты сброшены");
    return true;
  } catch (error) {
    console.error("Ошибка при сбросе проектов:", error);
    return false;
  }
}

/**
 * Создает и добавляет тестовые проекты в хранилище
 * @returns true в случае успеха
 */
export function setupTestProjects(): boolean {
  try {
    // Получаем текущие проекты
    const existingProjects = getProjectsFromStorage();

    // Если есть проекты, не добавляем тестовые данные
    if (existingProjects.length > 0) {
      console.log("Проекты уже существуют, не добавляем тестовые данные");
      return true;
    }

    // Текущая дата и даты с диапазоном для тестовых проектов
    const currentDate = new Date();

    // Тестовые проекты с наглядными датами
    const testProjects = [
      {
        id: "test-project-1",
        name: "Тестовый веб-проект",
        description: "Разработка тестового веб-проекта для демонстрации",
        createdAt: currentDate.toISOString(),
        createdBy: "default-manager",
        startDate: currentDate.toISOString(),
        endDate: new Date(
          currentDate.getTime() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        tasks: [
          {
            id: "test-task-1",
            name: "Дизайн интерфейса",
            description: "Создание дизайна пользовательского интерфейса",
            price: 15000,
            estimatedTime: 20,
            startDate: currentDate.toISOString(),
            endDate: new Date(
              currentDate.getTime() + 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            assignedTo: "",
            assignedToNames: [],
            progress: 0,
          },
          {
            id: "test-task-2",
            name: "Разработка API",
            description: "Разработка API для взаимодействия с сервером",
            price: 25000,
            estimatedTime: 30,
            startDate: new Date(
              currentDate.getTime() + 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            endDate: new Date(
              currentDate.getTime() + 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            assignedTo: "",
            assignedToNames: [],
            progress: 0,
          },
        ],
      },
      {
        id: "test-project-2",
        name: "Тестовое мобильное приложение",
        description:
          "Разработка тестового мобильного приложения для демонстрации",
        createdAt: currentDate.toISOString(),
        createdBy: "default-manager",
        startDate: currentDate.toISOString(),
        endDate: new Date(
          currentDate.getTime() + 45 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        tasks: [
          {
            id: "test-task-3",
            name: "Дизайн приложения",
            description: "Создание дизайна мобильного приложения",
            price: 18000,
            estimatedTime: 24,
            startDate: currentDate.toISOString(),
            endDate: new Date(
              currentDate.getTime() + 12 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            assignedTo: "",
            assignedToNames: [],
            progress: 0,
          },
          {
            id: "test-task-4",
            name: "Разработка клиентской части",
            description: "Разработка клиентской части мобильного приложения",
            price: 30000,
            estimatedTime: 40,
            startDate: new Date(
              currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            endDate: new Date(
              currentDate.getTime() + 25 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            assignedTo: "",
            assignedToNames: [],
            progress: 0,
          },
        ],
      },
    ];

    // Сохраняем тестовые проекты в хранилище
    localStorage.setItem("projects", JSON.stringify(testProjects));
    console.log("Тестовые проекты успешно добавлены", testProjects);

    return true;
  } catch (error) {
    console.error("Ошибка при добавлении тестовых проектов:", error);
    return false;
  }
}
