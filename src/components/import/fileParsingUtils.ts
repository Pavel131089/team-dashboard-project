
import { Project, Task } from '@/types/project';
import { toast } from 'sonner';

/**
 * Парсит строку CSV, учитывая кавычки
 */
export const parseCSVRow = (row: string): string[] => {
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
};

/**
 * Функция для парсинга даты из строки
 */
export const parseDate = (dateStr: string): string | null => {
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
};

/**
 * Функция для проверки валидности проекта
 */
export const isValidProject = (obj: any): obj is Project => {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.name === 'string' && 
         (!obj.tasks || Array.isArray(obj.tasks));
};

/**
 * Обрабатывает файл CSV
 */
export const parseCSVFile = (
  csvContent: string, 
  onImport: (project: Project) => void,
  resetForm: () => void
) => {
  // Проверяем, что файл не пустой
  if (!csvContent.trim()) {
    throw new Error('Файл пуст');
  }

  // Разбиваем на строки и убираем пустые
  const rows = csvContent.split('\n').filter(row => row.trim());
  if (rows.length < 2) {
    throw new Error('Файл не содержит данных или заголовков');
  }

  // Парсим заголовки и данные
  const headers = parseCSVRow(rows[0]);
  const expectedHeaders = ['Проект', 'Задача', 'Описание', 'Стоимость', 'Время', 'Прогресс', 'Исполнитель', 'Дата начала', 'Дата окончания'];
  
  // Проверяем, что все нужные заголовки присутствуют
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Отсутствуют обязательные заголовки: ${missingHeaders.join(', ')}`);
  }

  // Создаем структуру для группировки задач по проектам
  const projectsMap = new Map<string, { 
    name: string, 
    tasks: Task[] 
  }>();

  // Обрабатываем строки данных
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    
    const rowData = parseCSVRow(rows[i]);
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

    // Создаем задачу
    const price = parseFloat(rowObject['Стоимость']) || 0;
    const time = parseFloat(rowObject['Время']) || 0;
    const progress = parseInt(rowObject['Прогресс']) || 0;
    
    const task: Task = {
      id: crypto.randomUUID(),
      name: rowObject['Задача'] || `Задача ${i}`,
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

    projectsMap.get(projectName)!.tasks.push(task);
  }

  // Если нет ни одного проекта или задачи, выдаем ошибку
  if (projectsMap.size === 0) {
    throw new Error('Не удалось извлечь данные о проектах из файла');
  }

  // Создаем проекты из извлеченных данных
  let importCount = 0;
  projectsMap.forEach((projectData, projectName) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      description: `Импортировано ${new Date().toLocaleDateString()}`,
      tasks: projectData.tasks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onImport(newProject);
    importCount++;
  });

  toast.success(`Успешно импортировано проектов: ${importCount}`);
  resetForm();
};

/**
 * Обрабатывает файл JSON
 */
export const parseJSONFile = (
  jsonContent: string, 
  onImport: (project: Project) => void,
  resetForm: () => void
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
        if (isValidProject(item)) {
          const newProject: Project = {
            ...item,
            id: item.id || crypto.randomUUID(),
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Убедимся, что у задач есть ID
          newProject.tasks = (newProject.tasks || []).map(task => ({
            ...task,
            id: task.id || crypto.randomUUID()
          }));
          
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
    else if (isValidProject(data)) {
      const newProject: Project = {
        ...data,
        id: data.id || crypto.randomUUID(),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Убедимся, что у задач есть ID
      newProject.tasks = (newProject.tasks || []).map(task => ({
        ...task,
        id: task.id || crypto.randomUUID()
      }));
      
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
