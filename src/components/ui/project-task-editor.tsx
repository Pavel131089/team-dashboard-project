
import { useState } from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface ProjectTaskEditorProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
}

const ProjectTaskEditor = ({ project, onProjectUpdate }: ProjectTaskEditorProps) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    description: "",
    price: 0,
    estimatedTime: 0,
    startDate: "",
    endDate: "",
    assignedToNames: [],
    progress: 0,
  });

  const [assigneeInput, setAssigneeInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "assignedToNames") {
      setAssigneeInput(value);
      return;
    }
    
    let processedValue: string | number = value;
    if (name === "price" || name === "estimatedTime" || name === "progress") {
      processedValue = parseFloat(value) || 0;
    }
    
    setNewTask((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const addTask = () => {
    if (!newTask.name) {
      toast({
        title: "Ошибка",
        description: "Название задачи обязательно",
        variant: "destructive",
      });
      return;
    }

    // Process assignees
    const assignedToNames = assigneeInput
      ? assigneeInput.split(",").map((name) => name.trim())
      : [];

    const taskToAdd: Task = {
      id: `task-${Date.now()}`,
      ...newTask as Task,
      assignedToNames,
      assignedTo: assignedToNames.length > 0 ? assignedToNames : "",
    };

    const updatedProject: Project = {
      ...project,
      tasks: [...project.tasks, taskToAdd],
    };

    onProjectUpdate(updatedProject);
    
    // Reset form
    setNewTask({
      name: "",
      description: "",
      price: 0,
      estimatedTime: 0,
      startDate: "",
      endDate: "",
      assignedToNames: [],
      progress: 0,
    });
    setAssigneeInput("");
    
    toast({
      title: "Задача добавлена",
      description: `"${taskToAdd.name}" добавлена в проект "${project.name}"`,
    });
  };

  return (
    <div className="p-4 border-t">
      <h3 className="font-medium mb-4">Добавить задачу</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
            placeholder="Название задачи"
          />
        </div>
        
        <div>

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = project.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates };
      }
      return task;
    });
    
    const updatedProject = { ...project, tasks: updatedTasks };
    onProjectUpdate(updatedProject);
  };
  
  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = project.tasks.filter(task => task.id !== taskId);
    const updatedProject = { ...project, tasks: updatedTasks };
    onProjectUpdate(updatedProject);
    setShowAddTask(false);
    toast({
      title: "Задача удалена",
      description: "Задача была успешно удалена из проекта"
    });
  };

            onChange={handleInputChange}
            placeholder="Описание задачи"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={newTask.price === 0 ? "" : newTask.price}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={newTask.price === 0 ? "" : newTask.price}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="estimatedTime">Время (ч)</Label>
          <Input
            id="estimatedTime"
            name="estimatedTime"
            type="number"
            value={newTask.estimatedTime === 0 ? "" : newTask.estimatedTime}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="progress">Прогресс выполнения (%)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={newTask.progress === 0 ? "" : newTask.progress}
              onChange={handleInputChange}
              placeholder="0"
            />
            <input
              type="range"
              id="progress-slider"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={newTask.progress || 0}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="startDate">Плановая дата начала</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={newTask.startDate}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="endDate">Плановая дата окончания</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={newTask.endDate}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="md:col-span-2">
          <Button type="button" onClick={addTask} className="w-full">
            Добавить задачу
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskEditor;
