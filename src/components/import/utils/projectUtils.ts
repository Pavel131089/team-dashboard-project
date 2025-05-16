import { Project, Task } from "@/types/project";
import { parseDate } from "./dateUtils";

/**
 * Карта проекта для группировки задач
 */
export interface ProjectMap {
  name: string;
  tasks: Task[];
}

/**
 * Проверяет валидность проекта
 */
export function isValidProject(project: any): boolean {
  return (
    project &&
    typeof project === "object" &&
    typeof project.name === "string" &&
    (!project.tasks || Array.isArray(project.tasks))
  );
}

/**
 * Создает проект из имени и списка задач
 * @param projectName - Имя проекта
 * @param tasks - Список задач
 * @returns Новый проект
 */
export const createProject = (projectName: string, tasks: Task[]): Project => {
  return {
    id: crypto.randomUUID(),
    name: projectName,
    description: `Импортировано ${new Date().toLocaleDateString()}`,
    tasks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Создает проект из JSON данных
 */
export function createProjectFromJSON(data: any): Project {
  // Базовая структура проекта
  const project: Project = {
    id: data.id || crypto.randomUUID(),
    name: data.name,
    description: data.description || "",
    startDate: data.startDate || null, // Добавляем поддержку даты начала
    endDate: data.endDate || null, // Добавляем поддержку даты окончания
    tasks: [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  // Копируем задачи, если они есть
  if (Array.isArray(data.tasks)) {
    project.tasks = data.tasks.map((task: any) => ({
      id: task.id || crypto.randomUUID(),
      name: task.name,
      description: task.description || "",
      status: task.status || "TODO",
      priority: task.priority || "MEDIUM",
      price: task.price ? Number(task.price) : undefined,
      estimatedTime: task.estimatedTime
        ? Number(task.estimatedTime)
        : undefined,
      startDate: task.startDate || null,
      endDate: task.endDate || null,
      progress: task.progress ? Number(task.progress) : 0,
      assignedTo: task.assignedTo || null,
      assignedToNames: Array.isArray(task.assignedToNames)
        ? task.assignedToNames
        : task.assignedTo
          ? Array.isArray(task.assignedTo)
            ? task.assignedTo
            : [task.assignedTo]
          : [],
      actualStartDate: task.actualStartDate || null,
      actualEndDate: task.actualEndDate || null,
    }));
  }

  return project;
}

/**
 * Обновляет задачи проекта, добавляя ID если нужно
 * @param tasks - Массив задач
 * @returns Обновленный массив задач
 */
export const updateTasksWithIds = (tasks: Task[] = []): Task[] => {
  return tasks.map((task) => ({
    ...task,
    id: task.id || crypto.randomUUID(),
  }));
};

/**
 * Создает новую задачу из данных строки CSV
 * @param rowObject - Объект с данными строки CSV
 * @param index - Индекс строки
 * @returns Новая задача
 */
export const createTaskFromCSVRow = (
  rowObject: Record<string, string>,
  index: number,
): Task => {
  const price = parseFloat(rowObject["Стоимость"]) || 0;
  const time = parseFloat(rowObject["Время"]) || 0;
  const progress = parseInt(rowObject["Прогресс"]) || 0;

  return {
    id: crypto.randomUUID(),
    name: rowObject["Задача"] || `Задача ${index}`,
    description: rowObject["Описание"] || "",
    status: progress === 100 ? "DONE" : "TODO",
    priority: "MEDIUM",
    price: price,
    estimatedTime: time,
    startDate: parseDate(rowObject["Дата начала"]),
    endDate: parseDate(rowObject["Дата окончания"]),
    progress: progress,
    assignedTo: rowObject["Исполнитель"]
      ? rowObject["Исполнитель"].split(",").map((s) => s.trim())
      : null,
    actualStartDate: null,
    actualEndDate: null,
  };
};

/**
 * Преобразует коллекцию проектов в Map в массив проектов
 * @param projectsMap - Map с проектами и их задачами
 * @returns Массив проектов
 */
export const convertProjectMapToArray = (
  projectsMap: Map<string, ProjectMap>,
): Project[] => {
  const projects: Project[] = [];

  projectsMap.forEach((projectData, projectName) => {
    projects.push(createProject(projectName, projectData.tasks));
  });

  return projects;
};

/**
 * Группирует задачи по проектам
 * @param rowObjects - Массив объектов с данными строк
 * @returns Map с проектами и их задачами
 */
export const groupTasksByProject = (
  rowObjects: Record<string, string>[],
): Map<string, ProjectMap> => {
  const projectsMap = new Map<string, ProjectMap>();

  rowObjects.forEach((rowObject, index) => {
    const projectName = rowObject["Проект"];
    if (!projectName) return;

    // Получаем или создаем проект
    if (!projectsMap.has(projectName)) {
      projectsMap.set(projectName, {
        name: projectName,
        tasks: [],
      });
    }

    // Создаем задачу и добавляем в проект
    const task = createTaskFromCSVRow(rowObject, index);
    projectsMap.get(projectName)!.tasks.push(task);
  });

  return projectsMap;
};
