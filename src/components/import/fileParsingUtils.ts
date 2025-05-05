
import { Project, Task } from '@/types/project';
import { toast } from 'sonner';

// Импорт утилит
import { parseCSVRow, validateCSVHeaders, rowsToObjects } from './utils/csvUtils';
import { groupTasksByProject, convertProjectMapToArray, isValidProject, createProjectFromJSON } from './utils/projectUtils';

// Типы
type ResetFormFunction = () => void;
type ImportCallback = (project: Project) => void;

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
    // Базовая валидация
    validateCSVContent(csvContent);

    // Разбиваем на строки и убираем пустые
    const rows = csvContent.split('\n').filter(row => row.trim());
    
    // Парсим заголовки
    const headers = parseCSVRow(rows[0]);
    validateCSVHeadersAndThrow(headers);

    // Преобразуем строки в объекты
    const dataRows = rows.slice(1).filter(row => row.trim());
    const rowObjects = rowsToObjects(dataRows, headers);
    
    // Группируем задачи по проектам
    const projectsMap = groupTasksByProject(rowObjects);
    validateProjectsMap(projectsMap);

    // Создаем и импортируем проекты
    importProjects(projectsMap, onImport);
    
    // Очищаем форму и показываем сообщение об успехе
    toast.success(`Успешно импортировано проектов: ${projectsMap.size}`);
    resetForm();
  } catch (error) {
    console.error('Ошибка при обработке CSV:', error);
    throw error;
  }
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
    validateJSONData(data);

    // Обрабатываем в зависимости от типа данных
    if (Array.isArray(data)) {
      handleJSONArray(data, onImport, resetForm);
    } else {
      handleJSONObject(data, onImport, resetForm);
    }
  } catch (err) {
    console.error('Ошибка при обработке JSON:', err);
    throw new Error('Ошибка при обработке JSON файла');
  }
};

// Вспомогательные функции

/**
 * Проверяет базовую валидность содержимого CSV
 */
function validateCSVContent(csvContent: string): void {
  if (!csvContent.trim()) {
    throw new Error('Файл пуст');
  }

  const rows = csvContent.split('\n').filter(row => row.trim());
  if (rows.length < 2) {
    throw new Error('Файл не содержит данных или заголовков');
  }
}

/**
 * Проверяет валидность заголовков CSV и выбрасывает ошибку если они невалидны
 */
function validateCSVHeadersAndThrow(headers: string[]): void {
  const { isValid, missingHeaders } = validateCSVHeaders(headers);
  
  if (!isValid) {
    throw new Error(`Отсутствуют обязательные заголовки: ${missingHeaders.join(', ')}`);
  }
}

/**
 * Проверяет, что карта проектов не пуста
 */
function validateProjectsMap(projectsMap: Map<string, any>): void {
  if (projectsMap.size === 0) {
    throw new Error('Не удалось извлечь данные о проектах из файла');
  }
}

/**
 * Преобразует карту проектов в массив и выполняет импорт
 */
function importProjects(projectsMap: Map<string, any>, onImport: ImportCallback): void {
  const projects = convertProjectMapToArray(projectsMap);
  projects.forEach(onImport);
}

/**
 * Проверяет валидность JSON данных
 */
function validateJSONData(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Неверный формат JSON файла');
  }
}

/**
 * Обрабатывает массив данных из JSON
 */
function handleJSONArray(data: any[], onImport: ImportCallback, resetForm: ResetFormFunction): void {
  let importCount = 0;
  
  data.forEach(item => {
    if (isValidProject(item)) {
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

/**
 * Обрабатывает одиночный объект из JSON
 */
function handleJSONObject(data: any, onImport: ImportCallback, resetForm: ResetFormFunction): void {
  if (isValidProject(data)) {
    const newProject = createProjectFromJSON(data);
    onImport(newProject);
    toast.success(`Проект "${newProject.name}" успешно импортирован`);
    resetForm();
  } else {
    throw new Error('В файле не найдено действительных проектов');
  }
}
