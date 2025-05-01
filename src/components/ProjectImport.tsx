
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Project, Task } from '../types/project';
import Icon from './ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import Icon from './ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('csv');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Если имя проекта пустое, предлагаем имя файла без расширения
      if (!projectName) {
        const fileName = selectedFile.name.split('.')[0];
        setProjectName(fileName);
      }
      setError(null);
    }
  };

  const resetForm = () => {
    setFile(null);
    setProjectName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Улучшенная функция для парсинга CSV
  const processCSVData = (content: string): Task[] => {
    try {
      console.log("Начинаем обработку CSV данных");
      console.log("Содержимое файла:", content.substring(0, 200) + "...");
      
      // Разбиваем на строки, отфильтровываем пустые строки
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
      console.log(`Количество строк: ${lines.length}`);
      
      if (lines.length < 2) {
        throw new Error('Файл должен содержать как минимум заголовок и одну строку данных');
      }

      // Получаем заголовки из первой строки и нормализуем их
      const headerLine = lines[0];
      console.log(`Строка заголовков: ${headerLine}`);
      
      // Парсим заголовки с учетом возможных кавычек
      const headers = parseCSVLine(headerLine).map(h => h.trim().toLowerCase());
      console.log(`Обработанные заголовки: ${JSON.stringify(headers)}`);
      
      // Проверяем наличие обязательного заголовка "Наименование работ"
      const nameIndex = headers.findIndex(h => 
        ['name', 'название', 'задача', 'наименование', 'работы', 'работа', 'наименованиеработ', 'наименование_работ', 'наименованиеработ']
          .includes(h.replace(/[\s_-]/g, ''))
      );
      
      console.log(`Индекс колонки с названием: ${nameIndex}`);
      
      if (nameIndex === -1) {
        throw new Error('В файле должна быть колонка с названием работы (наименование работ, название, задача)');
      }
      
      // Находим индексы других колонок
      const descriptionIndex = headers.findIndex(h => 
        ['description', 'описание', 'desc', 'коментарий', 'комментарий', 'примечание']
          .includes(h.replace(/[\s_-]/g, ''))
      );
      
      console.log(`Индекс колонки с описанием: ${descriptionIndex}`);
      
      const estimatedTimeIndex = headers.findIndex(h => 
        ['estimatedtime', 'время', 'тз', 'трудозатраты', 'трудоемкость', 'часы']
          .includes(h.replace(/[\s_-]/g, ''))
      );
      
      console.log(`Индекс колонки с трудозатратами: ${estimatedTimeIndex}`);
      
      const priceIndex = headers.findIndex(h => 
        ['price', 'стоимость', 'цена', 'сумма']
          .includes(h.replace(/[\s_-]/g, ''))
      );
      
      console.log(`Индекс колонки со стоимостью: ${priceIndex}`);

      const tasks: Task[] = [];

      // Обрабатываем строки данных, начиная со второй строки
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Используем специальную функцию для правильного парсинга CSV
        const columns = parseCSVLine(line);
        console.log(`Строка ${i}: ${JSON.stringify(columns)}`);
        
        // Проверяем наличие имени задачи
        const taskName = nameIndex >= 0 && columns.length > nameIndex ? columns[nameIndex] : '';
        if (!taskName || taskName.trim() === '') {
          console.log(`Пропускаем строку ${i}, нет имени задачи`);
          continue; // Пропускаем задачи без имени
        }

        // Создаем объект задачи
        const task: Task = {
          id: crypto.randomUUID(),
          name: taskName,
          description: descriptionIndex >= 0 && columns.length > descriptionIndex 
            ? columns[descriptionIndex] 
            : '',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: [],
          progress: 0,
          estimatedTime: estimatedTimeIndex >= 0 && columns.length > estimatedTimeIndex 
            ? parseFloat(columns[estimatedTimeIndex].replace(',', '.')) || 0 
            : 0,
          price: priceIndex >= 0 && columns.length > priceIndex 
            ? parseFloat(columns[priceIndex].replace(',', '.')) || 0 
            : 0,
          startDate: null,
          endDate: null,
          actualStartDate: null,
          actualEndDate: null,
          comments: [],
          assignedToNames: []
        };
        
        tasks.push(task);
        console.log(`Добавлена задача: ${task.name}`);
      }

      console.log(`Всего обработано задач: ${tasks.length}`);
      return tasks;
    } catch (error) {
      console.error('Ошибка при обработке CSV:', error);
      throw error;
    }
  };

  // Специальная функция для правильного парсинга CSV строки
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = i < line.length - 1 ? line[i + 1] : '';
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Экранированная кавычка внутри значения в кавычках
          currentValue += '"';
          i++; // Пропускаем следующую кавычку
        } else {
          // Переключаем режим кавычек
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Разделитель вне кавычек
        result.push(currentValue);
        currentValue = '';
      } else {
        // Обычный символ
        currentValue += char;
      }
    }
    
    // Добавляем последнее значение
    result.push(currentValue);
    return result;
  };

  // Функция для обработки XLS/XLSX файлов
  const processExcelFile = async (file: File): Promise<Task[]> => {
    try {
      // Для обработки Excel файлов потребуется дополнительная библиотека
      // Например, xlsx или exceljs
      // Для этого примера просто сообщаем пользователю, что нужно установить эти библиотеки
      
      console.log('Начинаем импорт Excel файла:', file.name);
      
      throw new Error('Для поддержки Excel файлов необходимо установить библиотеку xlsx. Обратитесь к разработчику.');
      
      // После установки библиотеки xlsx можно будет реализовать так:
      /*
      const XLSX = await import('xlsx');
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('Файл должен содержать как минимум заголовок и одну строку данных');
      }
      
      // Обработка заголовков
      const headers = (jsonData[0] as string[]).map(h => h.trim().toLowerCase());
      
      // Проверка и обработка данных, аналогично CSV
      // ...
      
      // Возвращаем массив задач
      return tasks;
      */
    } catch (error) {
      console.error('Ошибка при обработке Excel файла:', error);
      throw error;
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Выберите файл для импорта');
      return;
    }

    if (!projectName) {
      setError('Введите название проекта');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      console.log(`Импортируем файл ${file.name}, размер: ${file.size} байт`);
      
      let tasks: Task[] = [];
      const fileExt = file.name.split('.').pop()?.toLowerCase();

      // Определяем формат файла по расширению
      if (fileExt === 'csv') {
        console.log('Обрабатываем как CSV файл');
        const content = await file.text();
        console.log(`Получено содержимое файла, длина: ${content.length} символов`);
        tasks = processCSVData(content);
      } else if (['xls', 'xlsx'].includes(fileExt || '')) {
        console.log('Обрабатываем как Excel файл');
        try {
          tasks = await processExcelFile(file);
        } catch (excelError) {
          const errorMessage = excelError instanceof Error ? excelError.message : 'Ошибка при обработке Excel файла';
          throw new Error(errorMessage);
        }
      } else {
        throw new Error('Неподдерживаемый формат файла. Используйте .csv, .xls или .xlsx');
      }

      if (tasks.length === 0) {
        throw new Error('Не удалось импортировать задачи из файла. Проверьте формат файла и структуру данных.');
      }

      // Создаем проект
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: projectName,
        description: `Импортировано из ${file.name}`,
        tasks: tasks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log(`Создан проект "${projectName}" с ${tasks.length} задачами`);
      
      // Вызываем callback
      onImport(newProject);
      toast.success(`Проект "${projectName}" успешно создан с ${tasks.length} задачами`);
      resetForm();
    } catch (err) {
      console.error('Ошибка импорта:', err);
      const message = err instanceof Error ? err.message : 'Произошла ошибка при импорте файла';
      setError(message);
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Icon name="FileUp" className="w-5 h-5 mr-2" />
          Импорт проекта
        </CardTitle>
        <CardDescription>
          Загрузите CSV или Excel файл с задачами для создания нового проекта
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium mb-1">
              Название проекта
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Введите название проекта"
              className="w-full"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv">CSV файл</TabsTrigger>
              <TabsTrigger value="excel">Excel файл</TabsTrigger>
            </TabsList>
            <TabsContent value="csv" className="mt-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="fileUpload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <div className="space-y-2">
                  <Icon name="FileText" className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm">
                    <label
                      htmlFor="fileUpload"
                      className="relative cursor-pointer text-primary underline"
                    >
                      <span>Выберите CSV файл</span>
                    </label>{' '}
                    или перетащите его сюда
                  </div>
                  <p className="text-xs text-gray-500">*.csv файлы</p>

                  {file && file.name.toLowerCase().endsWith('.csv') && (
                    <div className="mt-2 text-sm text-gray-500 flex justify-center items-center">
                      <Icon name="Check" className="w-4 h-4 mr-1 text-green-500" />
                      {file.name}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="excel" className="mt-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="excelFileUpload"
                  onChange={handleFileChange}
                  accept=".xls,.xlsx"
                  className="hidden"
                />
                <div className="space-y-2">
                  <Icon name="FileSpreadsheet" className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm">
                    <label
                      htmlFor="excelFileUpload"
                      className="relative cursor-pointer text-primary underline"
                    >
                      <span>Выберите Excel файл</span>
                    </label>{' '}
                    или перетащите его сюда
                  </div>
                  <p className="text-xs text-gray-500">*.xls, *.xlsx файлы</p>

                  {file && (file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx')) && (
                    <div className="mt-2 text-sm text-gray-500 flex justify-center items-center">
                      <Icon name="Check" className="w-4 h-4 mr-1 text-green-500" />
                      {file.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 text-amber-700 text-sm bg-amber-50 p-3 rounded">
                <Icon name="AlertTriangle" className="w-4 h-4 inline mr-1" />
                <span className="font-medium">Важно:</span> Для поддержки Excel файлов потребуется установить дополнительную библиотеку. 
                Обратитесь к разработчику для активации этой функции.
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              <Icon name="AlertTriangle" className="w-4 h-4 inline mr-1" />
              {error}
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={resetForm}>
              Отмена
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || isImporting}
            >
              {isImporting ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Импорт...
                </>
              ) : (
                <>
                  <Icon name="Upload" className="mr-2 h-4 w-4" />
                  Импортировать
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <p className="font-semibold mb-2">Формат CSV файла:</p>
            <div className="bg-slate-100 p-2 rounded mt-1 overflow-x-auto">
              <code>Наименование работ,Комментарий,Т/З,Стоимость</code>
            </div>
            <p className="mt-2 font-medium">
              Где:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Наименование работ</strong> - название задачи (обязательно)</li>
              <li><strong>Комментарий</strong> - описание или комментарий к задаче</li>
              <li><strong>Т/З</strong> - трудозатраты в часах</li>
              <li><strong>Стоимость</strong> - стоимость работы</li>
            </ul>
            <p className="mt-3 font-medium">Требования к CSV файлу:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Первая строка должна содержать заголовки колонок</li>
              <li>Колонки разделяются запятыми</li>
              <li>Текст с запятыми должен быть в кавычках: "Текст, с запятой"</li>
              <li>Файл должен быть сохранен в кодировке UTF-8</li>
            </ul>
            <p className="mt-3 font-medium">Пример правильного файла CSV:</p>
            <div className="bg-slate-100 p-2 rounded mt-1 overflow-x-auto mb-2">
              <code>Наименование работ,Комментарий,Т/З,Стоимость</code><br/>
              <code>Покраска стен,Покраска стен в гостиной,4,5000</code><br/>
              <code>"Укладка плитки, санузел",Работы в ванной,8,12000</code>
            </div>
            <p className="mt-3 text-amber-700 font-medium">Распространенные проблемы:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Проверьте, что файл создан в программе Excel или аналогичном редакторе</li>
              <li>При сохранении выбирайте формат "CSV (разделители - запятые)"</li>
              <li>Избегайте специальных символов в заголовках</li>
              <li>Если используете Excel, проверьте региональные настройки (разделитель должен быть запятой)</li>
            </ul>
            
            <p className="mt-4 font-semibold mb-2">Формат Excel файла (XLSX):</p>
            <p>Структура Excel файла должна содержать те же колонки, что и CSV:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Первый лист (Sheet1) будет использован для импорта</li>
              <li>Первая строка должна содержать заголовки колонок</li>
              <li>Обязательна колонка "Наименование работ" или её аналог</li>
              <li>Дополнительные колонки: Комментарий, Т/З, Стоимость</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectImport;
