
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project, Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface ProjectImportProps {
  onImport: (projects: Project[]) => void;
}
const ProjectImport = ({ onImportComplete }: ProjectImportProps) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [tasks, setTasks] = useState<Omit<Task, 'id' | 'progress' | 'assignedTo' | 'actualStartDate' | 'actualEndDate'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        name: "",
        description: "",
        price: 0,
        estimatedTime: 0,
        startDate: null,
        endDate: null,
        assignedToNames: [],
      }
    ]);
  };

  const handleTaskChange = (index: number, field: keyof Omit<Task, 'id' | 'progress' | 'assignedTo' | 'actualStartDate' | 'actualEndDate'>, value: any) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0]);
      setError(null); // Сбрасываем ошибку при выборе нового файла
    }
  };

  const handleImportFromExcel = async () => {
    if (!excelFile) {
      setError("Пожалуйста, выберите файл для импорта");
      return;
    }

    if (!projectName.trim()) {
      setError("Пожалуйста, введите название проекта перед импортом");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Создаем FileReader для чтения файла
      const reader = new FileReader();
      
      reader.onload = (evt) => {
        try {
          if (!evt.target || !evt.target.result) {
            throw new Error("Не удалось прочитать файл");
          }
          
          // Получаем содержимое файла как строку
          const csvContent = evt.target.result.toString();
          
          // Разбиваем по строкам
          const rows = csvContent.split('\n');
          
          // Проверяем, что есть хотя бы заголовок и одна строка данных
          if (rows.length < 2) {
            throw new Error("Файл не содержит данных");
          }
          
          // Предполагаем, что первая строка - заголовки
          const headers = rows[0].split(',').map(header => header.trim());
          
          // Индексы колонок
          const nameIndex = headers.findIndex(h => h.toLowerCase().includes('название') || h.toLowerCase().includes('наименование'));
          const descIndex = headers.findIndex(h => h.toLowerCase().includes('описание') || h.toLowerCase().includes('комментарий'));
          const priceIndex = headers.findIndex(h => h.toLowerCase().includes('стоимость') || h.toLowerCase().includes('цена'));
          const timeIndex = headers.findIndex(h => h.toLowerCase().includes('время') || h.toLowerCase().includes('т/з'));
          
          if (nameIndex === -1) {
            throw new Error("В файле отсутствует колонка с названием задачи");
          }

          // Парсим строки данных
          const parsedTasks: Omit<Task, 'id' | 'progress' | 'assignedTo' | 'actualStartDate' | 'actualEndDate'>[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue; // Пропускаем пустые строки
            
            const columns = rows[i].split(',').map(col => col.trim());
            
            if (columns.length <= nameIndex) continue; // Пропускаем строки с недостаточным количеством колонок
            
            parsedTasks.push({
              name: columns[nameIndex] || "Без названия",
              description: descIndex >= 0 && columns.length > descIndex ? columns[descIndex] : "",
              price: priceIndex >= 0 && columns.length > priceIndex ? parseInt(columns[priceIndex]) || 0 : 0,
              estimatedTime: timeIndex >= 0 && columns.length > timeIndex ? parseInt(columns[timeIndex]) || 0 : 0,
              startDate: null,
              endDate: null,
              assignedToNames: [],
            });
          }
          
          if (parsedTasks.length === 0) {
            throw new Error("Не удалось импортировать задачи из файла");
          }
          
          // Добавляем импортированные задачи к существующим
          setTasks([...tasks, ...parsedTasks]);
          setExcelFile(null);
          
          toast({
            title: "Данные импортированы",
            description: `Импортировано ${parsedTasks.length} задач из файла`,
          });
          
        } catch (err: any) {
          setError(err.message || "Ошибка при обработке файла");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError("Ошибка чтения файла");
        setIsLoading(false);
      };
      
      // Начинаем чтение файла как текст
      reader.readAsText(excelFile);
      
    } catch (err: any) {
      setError(err.message || "Произошла ошибка при импорте из файла");
      console.error(err);
      setIsLoading(false);
    }
  };



  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      setError("Пожалуйста, введите название проекта");
      return;
    }
    
    if (tasks.length === 0) {
      setError("Добавьте хотя бы одну задачу к проекту");
      return;
    }

    // Проверка заполнения всех задач
    const invalidTasks = tasks.filter(task => !task.name.trim());
    if (invalidTasks.length > 0) {
      setError("Пожалуйста, заполните название для всех задач");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Загрузим существующие проекты, чтобы добавить новый
      const existingProjectsStr = localStorage.getItem("projects");
      const existingProjects: Project[] = existingProjectsStr ? JSON.parse(existingProjectsStr) : [];
      
      // Создаем новый проект с уникальным ID
      const newProject: Project = {
        id: `p${Date.now()}`,
        name: projectName,
        description: projectDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: tasks.map((task, index) => ({
          ...task,
          id: `t${Date.now()}-${index}`,
          progress: 0,
          assignedTo: null,
          assignedToNames: task.assignedToNames || [],
          actualStartDate: null,
          actualEndDate: null
        }))
      };
      
      // Добавляем новый проект к существующим
      const updatedProjects = [...existingProjects, newProject];
      
      // Сохраняем обновленные проекты в localStorage
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      
      // Обновляем проекты в родительском компоненте
      onImportComplete(updatedProjects);
      
      toast({
        title: "Проект успешно создан",
        description: `Добавлен проект "${projectName}" с ${tasks.length} задачами`,
      });
      
      // Сбрасываем форму
      setProjectName("");
      setProjectDescription("");
      setTasks([]);
      
    } catch (err) {
      setError("Произошла ошибка при создании проекта");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">Название проекта</Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Введите название проекта"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-description">Описание проекта</Label>
          <Textarea
            id="project-description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Введите описание проекта"
          />
        </div>

        {/* Excel импорт */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="excel-import">Импорт задач из Excel</Label>
                <Input
                  id="excel-import"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-slate-500">
                  Поддерживаются файлы Excel (.xlsx, .xls)
                </p>
              </div>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleImportFromExcel}
                disabled={!excelFile || isLoading}
              >
                <Icon name="FileSpreadsheet" className="w-4 h-4 mr-2" />
                Импортировать задачи из Excel
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Задачи проекта</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddTask}
            >
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Добавить задачу
            </Button>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-slate-50">
              <p className="text-slate-500">Нет добавленных задач</p>
              <p className="text-sm text-slate-400 mt-2">
                Нажмите "Добавить задачу" для создания новой задачи или импортируйте из Excel
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <Card key={index} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveTask(index)}
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`task-name-${index}`}>Наименование работ</Label>
                        <Input
                          id={`task-name-${index}`}
                          value={task.name}
                          onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                          placeholder="Введите название задачи"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`task-description-${index}`}>Комментарий</Label>
                        <Input
                          id={`task-description-${index}`}
                          value={task.description}
                          onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                          placeholder="Введите описание задачи"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`task-time-${index}`}>Т/З (часы)</Label>
                        <Input
                          id={`task-time-${index}`}
                          type="number"
                          min="0"
                          value={task.estimatedTime || ""}
                          onChange={(e) => handleTaskChange(index, 'estimatedTime', parseInt(e.target.value) || 0)}
                          placeholder="Введите время в часах"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`task-price-${index}`}>Стоимость (₽)</Label>
                        <Input
                          id={`task-price-${index}`}
                          type="number"
                          min="0"
                          value={task.price || ""}
                          onChange={(e) => handleTaskChange(index, 'price', parseInt(e.target.value) || 0)}
                          placeholder="Введите стоимость в рублях"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveProject} 
          disabled={isLoading}
        >
          {isLoading ? (
            "Сохранение..."
          ) : (
            <>
              <Icon name="Save" className="w-4 h-4 mr-2" />
              Создать проект
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProjectImport;
