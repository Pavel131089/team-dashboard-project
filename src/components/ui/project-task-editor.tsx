
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { Project, Task } from "@/types/project";

interface ProjectTaskEditorProps {
  project: Project;
  onProjectUpdate: (updatedProject: Project) => void;
}

const ProjectTaskEditor = ({ project, onProjectUpdate }: ProjectTaskEditorProps) => {
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTasks(project.tasks);
  }, [project.tasks]);

  const handleAddTask = () => {
    const newTask: Task = {
      id: `t${Date.now()}-${tasks.length}`,
      name: "",
      description: "",
      price: 0,
      estimatedTime: 0,
      startDate: null,
      endDate: null,
      progress: 0,
      assignedTo: null,
      assignedToNames: [],
      actualStartDate: null,
      actualEndDate: null
    };
    
    setTasks([...tasks, newTask]);
    setIsEditing(true);
  };

  const handleTaskChange = (index: number, field: keyof Task, value: any) => {
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

  const handleSave = () => {
    // Проверка заполнения всех задач
    const invalidTasks = tasks.filter(task => !task.name.trim());
    if (invalidTasks.length > 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните название для всех задач",
        variant: "destructive"
      });
      return;
    }
    
    const updatedProject: Project = {
      ...project,
      tasks: tasks,
      updatedAt: new Date().toISOString()
    };
    
    onProjectUpdate(updatedProject);
    setIsEditing(false);
    
    toast({
      title: "Успешно",
      description: "Задачи проекта обновлены",
    });
  };

  const handleCancel = () => {
    setTasks(project.tasks);
    setIsEditing(false);
  };

  const handleDeleteProject = () => {
    if (confirm("Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.")) {
      // Создаем обновленный проект с пустым массивом задач для обозначения удаления
      const deletedProject: Project = {
        ...project,
        _deleted: true // Специальный флаг для обозначения удаления
      } as Project & { _deleted: boolean };
      
      onProjectUpdate(deletedProject);
      
      toast({
        title: "Проект удален",
        description: `Проект "${project.name}" был успешно удален`,
      });
    }
  };

  if (!isEditing) {
    return (
      <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddTask}
        >
          <Icon name="Plus" className="w-4 h-4 mr-2" />
          Добавить задачу
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDeleteProject}
        >
          <Icon name="Trash" className="w-4 h-4 mr-2" />
          Удалить проект
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t p-4 bg-slate-50 space-y-4">
      <h3 className="font-medium">Редактирование задач проекта</h3>
      
      {tasks.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-slate-500">Нет задач</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <Card key={task.id} className="relative">
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

                  <div className="space-y-2">
                    <Label htmlFor={`task-assignedToNames-${index}`}>Исполнители</Label>
                    <Input
                      id={`task-assignedToNames-${index}`}
                      value={task.assignedToNames?.join(', ') || ''}
                      onChange={(e) => {
                        const names = e.target.value.split(',').map(name => name.trim()).filter(Boolean);
                        handleTaskChange(index, 'assignedToNames', names);
                        // Также обновляем assignedTo для совместимости
                        handleTaskChange(index, 'assignedTo', names.length > 0 ? names : null);
                      }}
                      placeholder="Введите имена через запятую"
                    />
                  </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={handleCancel}
        >
          Отмена
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleAddTask}
          >
            <Icon name="Plus" className="w-4 h-4 mr-2" />
            Добавить задачу
          </Button>
          
          <Button 
            onClick={handleSave}
          >
            <Icon name="Save" className="w-4 h-4 mr-2" />
            Сохранить изменения
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskEditor;
