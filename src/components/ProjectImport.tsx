
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

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
    const lines = content.split(/\r\n|\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      throw new Error('Файл должен содержать как минимум заголовок и одну строку данных');
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
    
    // Найдем индексы нужных колонок
    const nameIndex = headers.findIndex(h => ['name', 'название', 'задача', 'task'].includes(h));
    const descriptionIndex = headers.findIndex(h => ['description', 'описание', 'desc'].includes(h));
    const statusIndex = headers.findIndex(h => ['status', 'статус'].includes(h));
    const priorityIndex = headers.findIndex(h => ['priority', 'приоритет'].includes(h));
    const assignedToIndex = headers.findIndex(h => ['assignedto', 'assigned to', 'assigned', 'исполнитель', 'назначено'].includes(h));
    const progressIndex = headers.findIndex(h => ['progress', 'прогресс', 'выполнено', 'done'].includes(h));
    const timeIndex = headers.findIndex(h => ['time', 'время', 'estimatedtime', 'estimated', 'оценка'].includes(h));

    if (nameIndex === -1) {
      throw new Error('В файле должна быть колонка с названием задачи (name, название, задача)');
    }

    const tasks: Task[] = [];

    // Начинаем с 1, чтобы пропустить заголовок
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Учитываем запятые внутри кавычек
      const columns = line.match(/(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g)
        ?.map(column => {
          // Убираем лишние запятые и кавычки
          return column.replace(/^,/, '').replace(/^"|"$/g, '').replace(/""/g, '"');
        }) || [];

      if (columns.length === 0 || columns.every(c => c.trim() === '')) {
        continue; // Пропускаем пустые строки
      }

      // Убедимся, что у нас есть имя задачи
      const taskName = nameIndex >= 0 && columns.length > nameIndex ? columns[nameIndex] : `Задача ${i}`;
      if (!taskName || taskName.trim() === '') {
        continue; // Пропускаем задачи без имени
      }

      tasks.push({
        id: uuidv4(),
        name: taskName,
        description: descriptionIndex >= 0 && columns.length > descriptionIndex ? columns[descriptionIndex] : '',
        status: statusIndex >= 0 && columns.length > statusIndex ? columns[statusIndex] : 'TODO',
        priority: priorityIndex >= 0 && columns.length > priorityIndex ? columns[priorityIndex] : 'MEDIUM',
        assignedTo: assignedToIndex >= 0 && columns.length > assignedToIndex && columns[assignedToIndex] 
          ? columns[assignedToIndex].split(',').map(id => id.trim()) 
          : [],
        progress: progressIndex >= 0 && columns.length > progressIndex ? parseInt(columns[progressIndex]) || 0 : 0,
        estimatedTime: timeIndex >= 0 && columns.length > timeIndex ? parseInt(columns[timeIndex]) || 0 : 0,
        startDate: null,
        endDate: null,
        assignedToNames: assignedToIndex >= 0 && columns.length > assignedToIndex && columns[assignedToIndex] 
          ? columns[assignedToIndex].split(',').map(name => name.trim()) 
          : [],
      });
    }

    return tasks;
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
      if (file.name.endsWith('.csv')) {
        tasks = processCSVData(content);
      } else {
        throw new Error('Неподдерживаемый формат файла. Используйте .csv');
      }

      if (tasks.length === 0) {
        throw new Error('Не удалось импортировать задачи из файла');
      }

      // Создаем проект
      const newProject: Project = {
        id: uuidv4(),
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

          <div className="mt-6 text-xs text-gray-500">
            <p className="font-semibold">Формат CSV файла:</p>
            <div className="bg-slate-100 p-2 rounded mt-1">
              <code>name,description,status,priority,assignedTo,progress,estimatedTime</code>
            </div>
            <p className="mt-2">
              Где:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>name</strong> - название задачи (обязательно)</li>
              <li><strong>description</strong> - описание задачи</li>
              <li><strong>status</strong> - статус задачи (TODO, IN_PROGRESS, DONE)</li>
              <li><strong>priority</strong> - приоритет (LOW, MEDIUM, HIGH)</li>
              <li><strong>assignedTo</strong> - исполнители (можно указать несколько через запятую)</li>
              <li><strong>progress</strong> - прогресс выполнения (число от 0 до 100)</li>
              <li><strong>estimatedTime</strong> - оценка времени в часах</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectImport;
