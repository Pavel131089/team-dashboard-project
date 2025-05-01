
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Project, Task } from '../types/project';
import Icon from './ui/icon';

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const processCSVData = (content: string): Task[] => {
    try {
      // Разбиваем на строки, отфильтровываем пустые строки
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        throw new Error('Файл должен содержать как минимум заголовок и одну строку данных');
      }

      // Получаем заголовки из первой строки и нормализуем их
      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
      
      // Проверяем наличие обязательного заголовка "Наименование работ"
      const nameIndex = headers.findIndex(h => 
        ['name', 'название', 'задача', 'наименование работ', 'наименование', 'работы', 'работа', 'наименование работ'].includes(h)
      );
      
      if (nameIndex === -1) {
        throw new Error('В файле должна быть колонка с названием работы (наименование работ, название, задача)');
      }
      
      // Находим индексы других колонок
      const descriptionIndex = headers.findIndex(h => 
        ['description', 'описание', 'desc', 'коментарий', 'комментарий', 'примечание'].includes(h)
      );
      
      const estimatedTimeIndex = headers.findIndex(h => 
        ['estimatedtime', 'время', 'т/з', 'трудозатраты', 'трудоемкость', 'часы'].includes(h)
      );
      
      const priceIndex = headers.findIndex(h => 
        ['price', 'стоимость', 'цена', 'сумма'].includes(h)
      );

      const tasks: Task[] = [];

      // Обрабатываем строки данных, начиная со второй строки
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Парсим CSV, учитывая возможные кавычки
        let columns: string[] = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            columns.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Добавляем последнюю колонку
        columns.push(currentValue.trim());

        // Проверяем наличие имени задачи
        const taskName = nameIndex >= 0 && columns.length > nameIndex ? columns[nameIndex] : '';
        if (!taskName || taskName.trim() === '') {
          continue; // Пропускаем задачи без имени
        }

        // Создаем объект задачи
        tasks.push({
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
            ? parseFloat(columns[estimatedTimeIndex]) || 0 
            : 0,
          price: priceIndex >= 0 && columns.length > priceIndex 
            ? parseFloat(columns[priceIndex]) || 0 
            : 0,
          startDate: null,
          endDate: null,
          actualStartDate: null,
          actualEndDate: null,
          comments: [],
          assignedToNames: []
        });
      }

      return tasks;
    } catch (error) {
      console.error('Ошибка при обработке CSV:', error);
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
      const content = await file.text();
      let tasks: Task[] = [];

      // Определяем формат файла по расширению
      if (file.name.toLowerCase().endsWith('.csv')) {
        tasks = processCSVData(content);
      } else {
        throw new Error('Неподдерживаемый формат файла. Используйте .csv');
      }

      if (tasks.length === 0) {
        throw new Error('Не удалось импортировать задачи из файла. Проверьте формат CSV.');
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

      // Вызываем callback
      onImport(newProject);
      toast.success(`Проект "${projectName}" успешно создан с ${tasks.length} задачами`);
      resetForm();
    } catch (err) {
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
          Загрузите CSV файл с задачами для создания нового проекта
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
                  <span>Выберите файл</span>
                </label>{' '}
                или перетащите его сюда
              </div>
              <p className="text-xs text-gray-500">CSV файлы</p>

              {file && (
                <div className="mt-2 text-sm text-gray-500 flex justify-center items-center">
                  <Icon name="Check" className="w-4 h-4 mr-1 text-green-500" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

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
              <li>Кавычки используются для текста, содержащего запятые</li>
              <li>Файл должен быть сохранен в кодировке UTF-8</li>
            </ul>
            <p className="mt-3 font-medium">Примечание:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Приоритет задачи устанавливается руководителем после импорта</li>
              <li>Исполнители назначаются автоматически, когда сотрудники берут задачи в работу</li>
              <li>Пример содержимого файла: <code>Покраска стен,Покраска стен в гостиной,4,5000</code></li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectImport;
