
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
  onImportComplete: (projects: Project[]) => void;
}

const ProjectImport = ({ onImportComplete }: ProjectImportProps) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [tasks, setTasks] = useState<Omit<Task, 'id' | 'progress' | 'assignedTo' | 'actualStartDate' | 'actualEndDate'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          assignedToNames: [],
          actualStartDate: null,
          actualEndDate: null
        }))
      };
      
      // Добавляем новый проект к существующим
      const updatedProjects = [...existingProjects, newProject];
      
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
                Нажмите "Добавить задачу" для создания новой задачи
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
