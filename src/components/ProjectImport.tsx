
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Project, Task } from '../types/project';
import Icon from './ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProject = () => {
    if (!projectName) {
      setError('Введите название проекта');
      return;
    }

    // Создаем проект с минимальными данными
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      description: projectDescription || 'Новый проект',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onImport(newProject);
    toast.success(`Проект "${projectName}" успешно создан`);
    resetForm();
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Проверяем тип файла
        if (file.name.endsWith('.csv')) {
          processCSVFile(e.target?.result as string);
        } else if (file.name.endsWith('.json')) {
          processJSONFile(e.target?.result as string);
        } else {
          setError('Поддерживаются только файлы .csv и .json');
        }
      } catch (err) {
        console.error('Ошибка обработки файла:', err);
        setError('Ошибка при обработке файла. Проверьте формат данных.');
      }
    };

    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      setError('Поддерживаются только файлы .csv и .json');
    }
  };

  const processCSVFile = (csvContent: string) => {
    // Проверяем, что файл не пустой
    if (!csvContent.trim()) {
      setError('Файл пуст');
      return;
    }

    // Разбиваем на строки и убираем пустые
    const rows = csvContent.split('\n').filter(row => row.trim());
    if (rows.length < 2) {
      setError('Файл не содержит данных или заголовков');
      return;
    }

    // Парсим заголовки и данные
    const headers = parseCSVRow(rows[0]);
    const expectedHeaders = ['Проект', 'Задача', 'Описание', 'Стоимость', 'Время', 'Прогресс', 'Исполнитель', 'Дата начала', 'Дата окончания'];
    
    // Проверяем, что все нужные заголовки присутствуют
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      setError(`Отсутствуют обязательные заголовки: ${missingHeaders.join(', ')}`);
      return;
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
      setError('Не удалось извлечь данные о проектах из файла');
      return;
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

  const processJSONFile = (jsonContent: string) => {
    try {
      const data = JSON.parse(jsonContent);
      
      // Проверка на правильный формат
      if (!data || typeof data !== 'object') {
        setError('Неверный формат JSON файла');
        return;
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
          setError('В файле не найдено действительных проектов');
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
        setError('В файле не найдено действительных проектов');
      }
    } catch (err) {
      console.error('Ошибка при обработке JSON:', err);
      setError('Ошибка при обработке JSON файла');
    }
  };

  // Функция для проверки валидности проекта
  const isValidProject = (obj: any): obj is Project => {
    return obj && 
           typeof obj === 'object' && 
           typeof obj.name === 'string' && 
           (!obj.tasks || Array.isArray(obj.tasks));
  };

  // Парсит строку CSV, учитывая кавычки
  const parseCSVRow = (row: string): string[] => {
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

  // Функция для парсинга даты из строки
  const parseDate = (dateStr: string): string | null => {
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Создать вручную</TabsTrigger>
          <TabsTrigger value="import">Импорт из файла</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Создать новый проект</CardTitle>
              <CardDescription>
                Заполните форму для создания нового проекта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName" className="block text-sm font-medium mb-1">
                    Название проекта *
                  </Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Введите название проекта"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectDescription" className="block text-sm font-medium mb-1">
                    Описание проекта
                  </Label>
                  <Textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Введите описание проекта"
                    className="w-full"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button onClick={handleCreateProject}>
                    <Icon name="PlusCircle" className="mr-2 h-4 w-4" />
                    Создать проект
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Импорт проекта из файла</CardTitle>
              <CardDescription>
                Загрузите файл CSV или JSON с данными о проектах и задачах
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="block text-sm font-medium mb-1">
                    Выберите файл
                  </Label>
                  <Input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Поддерживаются файлы .csv (разделитель - точка с запятой) и .json
                  </p>
                </div>

                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                  <h4 className="font-medium mb-2">Формат CSV файла:</h4>
                  <p className="text-sm text-slate-700">
                    Первая строка должна содержать заголовки: "Проект;Задача;Описание;Стоимость;Время;Прогресс;Исполнитель;Дата начала;Дата окончания"
                  </p>
                  <p className="text-sm text-slate-700 mt-2">
                    Пример содержимого:
                  </p>
                  <pre className="text-xs bg-slate-100 p-2 mt-1 rounded overflow-x-auto">
                    Проект;Задача;Описание;Стоимость;Время;Прогресс;Исполнитель;Дата начала;Дата окончания{"\n"}
                    Сайт компании;Дизайн главной;Разработка дизайна;10000;20;50;Иванов И.И.;01.06.2023;15.06.2023{"\n"}
                    Сайт компании;Вёрстка;Вёрстка главной;5000;10;0;Петров П.П.;16.06.2023;20.06.2023
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectImport;
