
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Project, Task } from '../types/project';
import Icon from './ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import * as XLSX from 'xlsx';

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('csv');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = '';
    }
  };

  // Функция для парсинга CSV
  const processCSVData = (content: string): Task[] => {
    try {
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        throw new Error('Файл должен содержать как минимум заголовок и одну строку данных');
      }

      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
      
      const nameIndex = headers.findIndex(h => 
        ['name', 'название', 'задача', 'наименование', 'работы'].includes(h)
      );
      
      if (nameIndex === -1) {
        throw new Error('В файле должна быть колонка с названием работы');
      }
      
      const descriptionIndex = headers.findIndex(h => 
        ['description', 'описание', 'комментарий'].includes(h)
      );
      
      const estimatedTimeIndex = headers.findIndex(h => 
        ['estimatedtime', 'время', 'трудозатраты'].includes(h)
      );
      
      const priceIndex = headers.findIndex(h => 
        ['price', 'стоимость', 'цена'].includes(h)
      );

      const tasks: Task[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',');
        
        const taskName = nameIndex >= 0 && columns.length > nameIndex ? columns[nameIndex] : '';
        if (!taskName || taskName.trim() === '') {
          continue;
        }

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
      }

      return tasks;
    } catch (error) {
      console.error('Ошибка при обработке CSV:', error);
      throw error;
    }
  };

  // Функция для парсинга Excel
  const processExcelData = async (file: File): Promise<Task[]> => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('Excel файл не содержит данных');
      }

      // Преобразуем данные в массив задач
      const tasks: Task[] = jsonData.map((row: any) => {
        // Ищем соответствующие поля в строке Excel
        const taskName = row['Наименование работ'] || row['Название'] || row['Задача'] || '';
        if (!taskName || taskName.trim() === '') {
          return null;
        }

        return {
          id: crypto.randomUUID(),
          name: taskName,
          description: row['Комментарий'] || row['Описание'] || '',
          status: 'TODO',
          priority: 'MEDIUM',
          assignedTo: [],
          progress: 0,
          estimatedTime: Number(row['Т/З'] || row['Трудозатраты'] || 0),
          price: Number(row['Стоимость'] || row['Цена'] || 0),
          startDate: null,
          endDate: null,
          actualStartDate: null,
          actualEndDate: null,
          comments: [],
          assignedToNames: []
        };
      }).filter(Boolean) as Task[];

      if (tasks.length === 0) {
        throw new Error('Не удалось распознать данные в Excel файле. Проверьте наличие колонки с названием работы.');
      }

      return tasks;
    } catch (error) {
      console.error('Ошибка при обработке Excel:', error);
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
      let tasks: Task[] = [];
      const fileExt = file.name.split('.').pop()?.toLowerCase();

      if (fileExt === 'csv') {
        const content = await file.text();
        tasks = processCSVData(content);
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        tasks = await processExcelData(file);
      } else {
        throw new Error('Неподдерживаемый формат файла. Используйте .csv, .xlsx или .xls');
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
      
      onImport(newProject);
      toast.success(`Проект "${projectName}" успешно создан с ${tasks.length} задачами`);
      resetForm();
    } catch (err: any) {
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
                  ref={excelFileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
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
                    </label>
                    {' '}или перетащите его сюда
                  </div>
                  <p className="text-xs text-gray-500">*.xls, *.xlsx файлы</p>
                  
                  {file && (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) && (
                    <div className="mt-2 text-sm text-gray-500 flex justify-center items-center">
                      <Icon name="Check" className="w-4 h-4 mr-1 text-green-500" />
                      {file.name}
                    </div>
                  )}
                </div>
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
            <p className="font-semibold mb-2">Формат файлов:</p>
            
            <p className="font-medium mt-2">CSV:</p>
            <div className="bg-slate-100 p-2 rounded mt-1 overflow-x-auto">
              <code>Наименование работ,Комментарий,Т/З,Стоимость</code>
            </div>
            
            <p className="font-medium mt-3">Excel:</p>
            <p className="text-sm">Первый лист должен содержать колонки:</p>
            <div className="bg-slate-100 p-2 rounded mt-1 overflow-x-auto">
              <code>Наименование работ | Комментарий | Т/З | Стоимость</code>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectImport;
