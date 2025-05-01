
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task, Project } from "@/types/project";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";

interface ProjectTaskEditorProps {
  project: Project;
  onProjectUpdate: (updatedProject: Project) => void;
}

const ProjectTaskEditor = ({ project, onProjectUpdate }: ProjectTaskEditorProps) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    description: "",
    price: 0,
    estimatedTime: 0,
    progress: 0,
    assignedTo: null,
    startDate: null,
    endDate: null,
    actualStartDate: null,
    actualEndDate: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (currentTask) {
      setCurrentTask({
        ...currentTask,
        [name]: name === "price" || name === "estimatedTime" ? Number(value) : value,
      });
    } else {
      setNewTask({
        ...newTask,
        [name]: name === "price" || name === "estimatedTime" ? Number(value) : value,
      });
    }
  };

  const addTask = () => {
    const taskToAdd: Task = {
      id: `task-${Date.now()}`,
      name: newTask.name || "Новая задача",
      description: newTask.description || "",
      price: newTask.price || 0,
      estimatedTime: newTask.estimatedTime || 0,
      progress: 0,
      assignedTo: null,
      assignedToNames: [],
      startDate: null,
      endDate: null,
      actualStartDate: null,
      actualEndDate: null,
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, taskToAdd],
    };

    onProjectUpdate(updatedProject);
    setIsAddTaskOpen(false);
    setNewTask({
      name: "",
      description: "",
      price: 0,
      estimatedTime: 0,
    });

    toast({
      title: "Задача добавлена",
      description: `Задача "${taskToAdd.name}" добавлена в проект`,
    });
  };

  const updateTask = () => {
    if (!currentTask) return;

    const updatedProject = {
      ...project,
      tasks: project.tasks.map((task) => 
        task.id === currentTask.id ? currentTask : task
      ),
    };

    onProjectUpdate(updatedProject);
    setIsEditTaskOpen(false);
    setCurrentTask(null);

    toast({
      title: "Задача обновлена",
      description: `Задача "${currentTask.name}" обновлена`,
    });
  };

  const deleteTask = (taskId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту задачу?")) return;

    const taskToDelete = project.tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    const updatedProject = {
      ...project,
      tasks: project.tasks.filter((task) => task.id !== taskId),
    };

    onProjectUpdate(updatedProject);

    toast({
      title: "Задача удалена",
      description: `Задача "${taskToDelete.name}" удалена из проекта`,
    });
  };

  const openEditDialog = (task: Task) => {
    setCurrentTask({...task});
    setIsEditTaskOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => setIsAddTaskOpen(true)}
        >
          <Icon name="Plus" className="mr-1 h-4 w-4" />
          Добавить задачу
        </Button>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую задачу</DialogTitle>
            <DialogDescription>
              Заполните информацию о новой задаче для проекта "{project.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Название задачи</Label>
              <Input
                id="name"
                name="name"
                value={newTask.name || ""}
                onChange={handleInputChange}
                placeholder="Введите название задачи"
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={newTask.description || ""}
                onChange={handleInputChange}
                placeholder="Описание задачи"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Стоимость (₽)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={newTask.price || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="estimatedTime">Время (часы)</Label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="number"
                  min="0"
                  value={newTask.estimatedTime || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>Отмена</Button>
            <Button onClick={addTask}>Добавить задачу</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать задачу</DialogTitle>
            <DialogDescription>
              Изменить информацию о задаче
            </DialogDescription>
          </DialogHeader>
          {currentTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Название задачи</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentTask.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Стоимость (₽)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    value={currentTask.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-estimatedTime">Время (часы)</Label>
                  <Input
                    id="edit-estimatedTime"
                    name="estimatedTime"
                    type="number"
                    min="0"
                    value={currentTask.estimatedTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTaskOpen(false)}>Отмена</Button>
            <Button onClick={updateTask}>Сохранить изменения</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {project.tasks.map((task) => (
          <div key={task.id} className="p-3 border rounded-md bg-slate-50 flex justify-between items-start">
            <div>
              <h4 className="font-medium">{task.name}</h4>
              <p className="text-sm text-slate-600 mt-1">{task.description}</p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{task.price} ₽</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">{task.estimatedTime} ч</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Исполнители: {task.assignedToNames?.length 
                    ? task.assignedToNames.join(', ') 
                    : (task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo.join(', ') : "—")}
                </span>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                <Icon name="Pencil" className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteTask(task.id)}>
                <Icon name="Trash" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectTaskEditor;
