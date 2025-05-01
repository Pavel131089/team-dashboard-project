
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project, Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";

interface ProjectImportProps {
  onImportComplete: (projects: Project[]) => void;
}

const ProjectImport = ({ onImportComplete }: ProjectImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Пожалуйста, выберите файл для импорта");
      return;
    }
    
    if (!['.csv', '.xlsx', '.xls'].some(ext => file.name.toLowerCase().endsWith(ext))) {
      setError("Пожалуйста, загрузите файл в формате CSV или Excel");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // В реальном приложении здесь бы был код для парсинга файла
      // Для демонстрации создадим тестовые данные
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
      
      const mockProjects: Project[] = [
        {
          id: "p1",
          name: "Разработка веб-сайта",
          description: "Корпоративный веб-сайт для компании",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tasks: [
            {
              id: "t1",
              name: "Дизайн главной страницы",
              description: "Создание макета главной страницы сайта",
              price: 15000,
              estimatedTime: 20,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 0,
              assignedTo: null,
              actualStartDate: null,
              actualEndDate: null
            },
            {
              id: "t2",
              name: "Вёрстка главной страницы",
              description: "HTML/CSS вёрстка по макету",
              price: 10000,
              estimatedTime: 15,
              startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 0,
              assignedTo: null,
              actualStartDate: null,
              actualEndDate: null
            }
          ]
        },
        {
          id: "p2",
          name: "Мобильное приложение",
          description: "Мобильное приложение для Android и iOS",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tasks: [
            {
              id: "t3",
              name: "Дизайн интерфейса",
              description: "Создание UI/UX для мобильного приложения",
              price: 25000,
              estimatedTime: 30,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 0,
              assignedTo: null,
              actualStartDate: null,
              actualEndDate: null
            }
          ]
        }
      ];
      
      // Обновляем проекты в родительском компоненте
      onImportComplete(mockProjects);
      
      toast({
        title: "Импорт успешно завершен",
        description: `Загружено проектов: ${mockProjects.length}, задач: ${mockProjects.reduce((acc, project) => acc + project.tasks.length, 0)}`,
      });
      
      // Сбрасываем состояние
      setFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError("Произошла ошибка при импорте файла");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Выберите файл для импорта</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <p className="text-xs text-slate-500">
          Поддерживаемые форматы: CSV, Excel (.xlsx, .xls)
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {file ? `Выбран файл: ${file.name}` : "Файл не выбран"}
        </div>
        <Button 
          onClick={handleImport} 
          disabled={!file || isLoading}
        >
          {isLoading ? "Импорт..." : "Импортировать"}
        </Button>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Инструкция по формату файла:</h3>
        <p className="text-sm text-slate-700 mb-2">
          Файл должен содержать следующие колонки:
        </p>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>Название проекта</li>
          <li>Описание проекта</li>
          <li>Название задачи</li>
          <li>Описание задачи</li>
          <li>Цена (в рублях)</li>
          <li>Оценка времени (в часах)</li>
          <li>Дата начала</li>
          <li>Дата окончания</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectImport;
