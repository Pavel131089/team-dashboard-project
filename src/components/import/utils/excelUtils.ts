
import * as XLSX from 'xlsx';
import { Task } from '@/types/project';

/**
 * Преобразует данные из Excel-файла в массив объектов
 * @param fileContent - ArrayBuffer содержимого Excel-файла
 * @returns массив объектов, представляющих строки Excel
 */
export const parseExcelFile = (fileContent: ArrayBuffer): Record<string, any>[] => {
  try {
    // Читаем файл Excel
    const workbook = XLSX.read(fileContent, { type: 'array' });
    
    // Берем первый лист
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Конвертируем в JSON с заголовками
    const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
    
    if (!data || data.length === 0) {
      throw new Error('Excel файл не содержит данных');
    }
    
    // Проверяем наличие обязательных полей
    validateExcelData(data);
    
    return data;
  } catch (error) {
    console.error('Ошибка при парсинге Excel файла:', error);
    throw new Error(error instanceof Error ? error.message : 'Ошибка при парсинге Excel файла');
  }
};

/**
 * Проверяет наличие обязательных полей в данных Excel
 * @param data - массив объектов из Excel
 */
const validateExcelData = (data: Record<string, any>[]): void => {
  const requiredFields = ['projectName', 'name'];
  const firstRow = data[0];
  
  // Проверяем наличие обязательных полей
  const missingFields = requiredFields.filter(field => 
    !Object.keys(firstRow).some(key => 
      key.toLowerCase() === field.toLowerCase() ||
      key.toLowerCase().replace(/\s+/g, '') === field.toLowerCase()
    )
  );
  
  if (missingFields.length > 0) {
    throw new Error(`В Excel-файле отсутствуют обязательные поля: ${missingFields.join(', ')}`);
  }
};

/**
 * Нормализует имена полей из Excel в формат, используемый в приложении
 * @param data - исходные данные из Excel
 * @returns нормализованные данные
 */
export const normalizeExcelData = (data: Record<string, any>[]): Record<string, any>[] => {
  const fieldMappings: Record<string, string> = {
    'projectname': 'projectName',
    'имяпроекта': 'projectName',
    'название проекта': 'projectName',
    'проект': 'projectName',
    
    'name': 'name',
    'имя': 'name',
    'названиезадачи': 'name',
    'название задачи': 'name',
    'задача': 'name',
    
    'description': 'description',
    'описание': 'description',
    
    'price': 'price',
    'цена': 'price',
    'стоимость': 'price',
    
    'estimatedtime': 'estimatedTime',
    'планируемоевремя': 'estimatedTime',
    'оценка времени': 'estimatedTime',
    'время': 'estimatedTime',
    
    'startdate': 'startDate',
    'датаначала': 'startDate',
    'дата начала': 'startDate',
    
    'enddate': 'endDate',
    'датаокончания': 'endDate',
    'дата окончания': 'endDate',
    
    'assignedto': 'assignedTo',
    'исполнители': 'assignedTo',
    'исполнитель': 'assignedTo',
    'assigned': 'assignedTo',
    
    'progress': 'progress',
    'прогресс': 'progress',
    'выполнение': 'progress',
  };
  
  return data.map(row => {
    const normalizedRow: Record<string, any> = {};
    
    // Обрабатываем каждое поле в строке
    Object.entries(row).forEach(([key, value]) => {
      // Приводим ключ к нижнему регистру и убираем пробелы для сопоставления
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
      
      // Ищем соответствие в маппинге полей
      const mappedKey = fieldMappings[normalizedKey] || key;
      
      // Если значение - строка, удаляем лишние пробелы
      if (typeof value === 'string') {
        normalizedRow[mappedKey] = value.trim();
      } else {
        normalizedRow[mappedKey] = value;
      }
    });
    
    return normalizedRow;
  });
};
