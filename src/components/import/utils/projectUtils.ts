
import { Project, Task } from '@/types/project';
import { parseDate } from './dateUtils';

/**
 * Карта проекта для группировки задач
 */
export interface ProjectMap {
  name: string;
  tasks: Task[];
}

/**
 * Проверяет, является ли объект валидным проектом
 * @param obj - Объект для проверки
 * @returns Результат типизации
 */
export const isValidProject = (obj: any): obj is Project => {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.name === 'string' && 
         (!obj.tasks || Array.isArray(obj.tasks));
};

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
 * Обновляет задачи проекта, добавляя ID если нужно
 * @param tasks - Массив задач
 * @returns Обновленный массив задач
 */
export const updateTasksWithIds = (tasks: Task[] = []): Task[] => {
  return tasks.map(task => ({
    ...task,
    id: task.id || crypto.randomUUID()
  }));
};

/**
 * Создает новый проект из JSON данных
 * @param data - JSON данные проекта
 * @returns Новый проект
 */
export const createProjectFromJSON = (data: any): Project => {
  return {
    ...data,
    id: data.id || crypto.randomUUID(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: updateTasksWithIds(data.tasks),
  };
};

/**
 * Создает новую задачу из данных строки CSV
 * @param rowObject - Объект с данными строки CSV
 * @param index - Индекс строки
 * @returns Новая задача
 */
export const createTaskFromCSVRow = (rowObject: Record<string, string>, index: number): Task => {
  const price = parseFloat(rowObject['Стоимость']) || 0;
  const time = parseFloat(rowObject['Время']) || 0;
  const progress = parseInt(rowObject['Прогресс']) || 0;
  
  return {
    id: crypto.randomUUID(),
    name: rowObject['Задача'] || `Задача ${index}`,
    description: rowObject['Описание'] || '',
    status: progress === 100 ? 'DONE' : 'TODO',
    priority: 'MEDIUM',
    price: price,
    estimatedTime: time,
    startDate: parseDate(rowObject['Дата начала']),
    endDate: parseDate(rowObject['Дата окончания']),
    progress: progress,
    assignedTo: rowObject['Исполнитель'] ? rowObject['Исполнитель'].split(',').map(s => s.trim()) : null,
    actualStartDate: null,
    actualEndDate: null,
  };
};

/**
 * Преобразует коллекцию проектов в Map в массив проектов
 * @param projectsMap - Map с проектами и их задачами
 * @returns Массив проектов
 */
export const convertProjectMapToArray = (projectsMap: Map<string, ProjectMap>): Project[] => {
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
export const groupTasksByProject = (rowObjects: Record<string, string>[]): Map<string, ProjectMap> => {
  const projectsMap = new Map<string, ProjectMap>();
  
  rowObjects.forEach((rowObject, index) => {
    const projectName = rowObject['Проект'];
    if (!projectName) return;
    
    // Получаем или создаем проект
    if (!projectsMap.has(projectName)) {
      projectsMap.set(projectName, { 
        name: projectName, 
        tasks: [] 
      });
    }
    
    // Создаем задачу и добавляем в проект
    const task = createTaskFromCSVRow(rowObject, index);
    projectsMap.get(projectName)!.tasks.push(task);
  });
  
  return projectsMap;
};
