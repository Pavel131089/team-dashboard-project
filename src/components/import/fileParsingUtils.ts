
import { Project, Task } from '@/types/project';
import { toast } from 'sonner';

// Типы и интерфейсы
interface ProjectMap {
  name: string;
  tasks: Task[];
}

type ResetFormFunction = () => void;
type ImportCallback = (project: Project) => void;

/**
 * Утилиты для работы с датами
 */
const dateUtils = {
  /**
   * Парсит дату из строки в ISO формат
   * @param dateStr - Строка с датой
   * @returns ISO строка даты или null, если парсинг не удался
   */
  parseDate: (dateStr: string): string | null => {
    if (!dateStr || dateStr === '—') return null;
    
    // Пытаемся распарсить как дату
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    // Преобразуем формат DD.MM.YYYY в YYYY-MM-DD
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const newDate = new Date(formattedDate);
      if (!isNaN(newDate.getTime())) {
        return newDate.toISOString();
      }
    }
    
    return null;
  }
};

/**
 * Утилиты для работы с CSV
 */
const csvUtils = {
  /**
   * Парсит строку CSV, учитывая кавычки
   * @param row - Строка CSV
   * @returns Массив значений из строки
   */
  parseCSVRow: (row: string): string[] => {
    const result: string[] = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];
      
      if (char === '"' && inQuotes && nextChar === '"') {
        // Экранированная кавычка внутри кавычек
        cell += '"';
        i++;
      } else if (char === '"') {
        // Начало или конец кавычек
        inQuotes = !inQuotes;
      } else if (char === ';' && !inQuotes) {
        // Разделитель вне кавычек
        result.push(cell);
        cell = '';
      } else {
        // Обычный символ
        cell += char;
      }
    }
    
    // Добавляем последнюю ячейку
    result.push(cell);
    
    return result;
  },

  /**
   * Проверяет валидность заголовков CSV
   * @param headers - Массив заголовков
   * @returns Объект с результатом проверки и отсутствующими заголовками
   */
  validateCSVHeaders: (headers: string[]): { isValid: boolean; missingHeaders: string[] } => {
    const expectedHeaders = [
      'Проект', 'Задача', 'Описание', 'Стоимость', 'Время', 
      'Прогресс', 'Исполнитель', 'Дата начала', 'Дата окончания'
    ];
    
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    return {
      isValid: missingHeaders.length === 0,
      missingHeaders
    };
  }
};

/**
 * Утилиты для валидации проектов
 */
const projectValidation = {
  /**
   * Проверяет, является ли объект валидным проектом
   * @param obj - Объект для проверки
   * @returns Результат типизации
   */
  isValidProject: (obj: any): obj is Project => {
    return obj && 
           typeof obj === 'object' && 
           typeof obj.name === 'string' && 
           (!obj.tasks || Array.isArray(obj.tasks));
  },

  /**
   * Создает проект из имени и списка задач
   * @param projectName - Имя проекта
   * @param tasks - Список задач
   * @returns Новый проект
   */
  createProject: (projectName: string, tasks: Task[]): Project => {
    return {
      id: crypto.randomUUID(),
      name: projectName,
      description: `Импортировано ${new Date().toLocaleDateString()}`,
      tasks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

/**
 * Создает новую задачу из данных строки CSV
 * @param rowObject - Объект с данными строки CSV
 * @param index - Индекс строки
 * @returns Новая задача
 */
const createTaskFromCSVRow = (rowObject: Record<string, string>, index: number): Task => {
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
    startDate: dateUtils.parseDate(rowObject['Дата начала']),
    endDate: dateUtils.parseDate(rowObject['Дата окончания']),
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
const convertProjectMapToArray = (projectsMap: Map<string, ProjectMap>): Project[] => {
  const projects: Project[] = [];
  
  projectsMap.forEach((projectData, projectName) => {
    projects.push(projectValidation.createProject(projectName, projectData.tasks));
  });
  
  return projects;
};

/**
 * Обрабатывает файл CSV
 * @param csvContent - Содержимое CSV файла
 * @param onImport - Callback для импорта проекта
 * @param resetForm - Функция для сброса формы
 */
export const parseCSVFile = (
  csvContent: string, 
  onImport: ImportCallback,
  resetForm: ResetFormFunction
) => {
  try {
    // Проверяем, что файл не пустой
    if (!csvContent.trim()) {
      throw new Error('Файл пуст');
    }

    // Разбиваем на строки и убираем пустые
    const rows = csvContent.split('\n').filter(row => row.trim());
    if (rows.length < 2) {
      throw new Error('Файл не содержит данных или заголовков');
    }

    // Парсим заголовки
    const headers = csvUtils.parseCSVRow(rows[0]);
    const { isValid, missingHeaders } = csvUtils.validateCSVHeaders(headers);
    
    if (!isValid) {
      throw new Error(`Отсутствуют обязательные заголовки: ${missingHeaders.join(', ')}`);
    }

    // Создаем структуру для группировки задач по проектам
    const projectsMap = new Map<string, ProjectMap>();

    // Обрабатываем строки данных
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue;
      
      const rowData = csvUtils.parseCSVRow(rows[i]);
      if (rowData.length < headers.length) continue;
      
      const rowObject: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowObject[header] = rowData[index] || '';
      });

      const projectName = rowObject['Проект'];
      if (!projectName) continue;

      // Получаем или создаем проект
      if (!projectsMap.has(projectName)) {
        projectsMap.set(projectName, { 
          name: projectName, 
          tasks: [] 
        });
      }

      // Создаем задачу и добавляем в проект
      const task = createTaskFromCSVRow(rowObject, i);
      projectsMap.get(projectName)!.tasks.push(task);
    }

    // Если нет ни одного проекта или задачи, выдаем ошибку
    if (projectsMap.size === 0) {
      throw new Error('Не удалось извлечь данные о проектах из файла');
    }

    // Преобразуем Map в массив проектов и импортируем их
    const projects = convertProjectMapToArray(projectsMap);
    projects.forEach(onImport);
    
    toast.success(`Успешно импортировано проектов: ${projects.length}`);
    resetForm();
  } catch (error) {
    console.error('Ошибка при обработке CSV:', error);
    throw error;
  }
};

/**
 * Обновляет задачи проекта, добавляя ID если нужно
 * @param tasks - Массив задач
 * @returns Обновленный массив задач
 */
const updateTasksWithIds = (tasks: Task[] = []): Task[] => {
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
const createProjectFromJSON = (data: any): Project => {
  return {
    ...data,
    id: data.id || crypto.randomUUID(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: updateTasksWithIds(data.tasks),
  };
};

/**
 * Обрабатывает файл JSON
 * @param jsonContent - Содержимое JSON файла
 * @param onImport - Callback для импорта проекта
 * @param resetForm - Функция для сброса формы
 */
export const parseJSONFile = (
  jsonContent: string, 
  onImport: ImportCallback,
  resetForm: ResetFormFunction
) => {
  try {
    const data = JSON.parse(jsonContent);
    
    // Проверка на правильный формат
    if (!data || typeof data !== 'object') {
      throw new Error('Неверный формат JSON файла');
    }

    // Если это массив проектов
    if (Array.isArray(data)) {
      let importCount = 0;
      
      data.forEach(item => {
        if (projectValidation.isValidProject(item)) {
          const newProject = createProjectFromJSON(item);
          onImport(newProject);
          importCount++;
        }
      });
      
      if (importCount > 0) {
        toast.success(`Успешно импортировано проектов: ${importCount}`);
        resetForm();
      } else {
        throw new Error('В файле не найдено действительных проектов');
      }
    } 
    // Если это один проект
    else if (projectValidation.isValidProject(data)) {
      const newProject = createProjectFromJSON(data);
      onImport(newProject);
      toast.success(`Проект "${newProject.name}" успешно импортирован`);
      resetForm();
    } else {
      throw new Error('В файле не найдено действительных проектов');
    }
  } catch (err) {
    console.error('Ошибка при обработке JSON:', err);
    throw new Error('Ошибка при обработке JSON файла');
  }
};
