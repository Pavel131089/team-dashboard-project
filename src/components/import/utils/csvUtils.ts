
/**
 * Утилиты для работы с CSV файлами
 */

/**
 * Ожидаемые заголовки CSV файла
 */
export const EXPECTED_HEADERS = [
  'Проект', 'Задача', 'Описание', 'Стоимость', 'Время', 
  'Прогресс', 'Исполнитель', 'Дата начала', 'Дата окончания'
];

/**
 * Результат проверки заголовков CSV
 */
export interface HeaderValidationResult {
  isValid: boolean;
  missingHeaders: string[];
}

/**
 * Парсит строку CSV, учитывая кавычки
 * @param row - Строка CSV
 * @returns Массив значений из строки
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
 * Проверяет валидность заголовков CSV
 * @param headers - Массив заголовков
 * @returns Объект с результатом проверки и отсутствующими заголовками
 */
export const validateCSVHeaders = (headers: string[]): HeaderValidationResult => {
  const missingHeaders = EXPECTED_HEADERS.filter(header => !headers.includes(header));
  return {
    isValid: missingHeaders.length === 0,
    missingHeaders
  };
};

/**
 * Преобразует строки CSV в массив объектов
 * @param rows - Строки CSV
 * @param headers - Заголовки CSV
 * @returns Массив объектов с данными
 */
export const rowsToObjects = (rows: string[], headers: string[]): Record<string, string>[] => {
  return rows.map(row => {
    const rowData = parseCSVRow(row);
    const rowObject: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      rowObject[header] = index < rowData.length ? rowData[index] : '';
    });
    
    return rowObject;
  });
};
