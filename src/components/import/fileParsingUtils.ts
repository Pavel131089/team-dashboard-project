import { Project, Task } from "@/types/project";
import { toast } from "sonner";

// Импорт утилит
import {
  parseCSVRow,
  validateCSVHeaders,
  rowsToObjects,
} from "./utils/csvUtils";
import {
  groupTasksByProject,
  convertProjectMapToArray,
  isValidProject,
  createProjectFromJSON,
} from "./utils/projectUtils";
import { parseExcelFile, normalizeExcelData } from "./utils/excelUtils";

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
  resetForm: ResetFormFunction,
) => {
  try {
    // Базовая валидация
    validateCSVContent(csvContent);

    // Разбиваем на строки и убираем пустые
    const rows = csvContent.split("\n").filter((row) => row.trim());

    // Парсим заголовки
    const headers = parseCSVRow(rows[0]);
    validateCSVHeadersAndThrow(headers);

    // Преобразуем строки в объекты
    const dataRows = rows.slice(1).filter((row) => row.trim());
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
    console.error("Ошибка при обработке CSV:", error);
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
  resetForm: ResetFormFunction,
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
    console.error("Ошибка при обработке JSON:", err);
    throw new Error("Ошибка при обработке JSON файла");
  }
};

/**
 * Обрабатывает файл Excel
 * @param excelContent - Содержимое Excel файла как ArrayBuffer
 * @param onImport - Callback для импорта проекта
 * @param resetForm - Функция для сброса формы
 */
export const parseExcelFile = (
  excelContent: ArrayBuffer,
  onImport: ImportCallback,
  resetForm: ResetFormFunction,
) => {
  try {
    // Парсим Excel-файл в массив объектов
    const excelData = parseExcelFile(excelContent);

    // Нормализуем имена полей (приводим к стандартным именам)
    const normalizedData = normalizeExcelData(excelData);

    // Группируем задачи по проектам
    const projectsMap = groupTasksByProject(normalizedData);
    validateProjectsMap(projectsMap);

    // Создаем и импортируем проекты
    importProjects(projectsMap, onImport);

    // Очищаем форму и показываем сообщение об успехе
    toast.success(`Успешно импортировано проектов: ${projectsMap.size}`);
    resetForm();
  } catch (error) {
    console.error("Ошибка при обработке Excel:", error);
    throw error;
  }
};

// Остальные вспомогательные функции остаются без изменений...
