
import { useState } from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface EmployeeTaskListProps {
  tasks: {project: Project; task: Task}[];
  userId: string;
  onTaskUpdate: (projectId: string, task: Task) => void;
}

const EmployeeTaskList = ({ tasks, userId, onTaskUpdate }: EmployeeTaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<{project: Project; task: Task} | null>(null);
  const [progressValue, setProgressValue] = useState<number[]>([0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleUpdateProgress = () => {
    if (!selectedTask) return;
    
    const newProgress = progressValue[0];

    const updatedTask: Task = {
      ...selectedTask.task,
      progress: newProgress,
      actualEndDate: newProgress === 100 ? new Date().toISOString() : selectedTask.task.actualEndDate
    };

    onTaskUpdate(selectedTask.project.id, updatedTask);



    
    onTaskUpdate(selectedTask.project.id, updatedTask);
    setIsDialogOpen(false);
    
    toast({
      title: "Прогресс обновлен",
      description: `Прогресс задачи "${selectedTask.task.name}" установлен на ${newProgress}%`,
    });
  };

  const openProgressDialog = (task: {project: Project; task: Task}) => {
    setSelectedTask(task);
    setProgressValue([task.task.progress]);
    setIsDialogOpen(true);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        У вас пока нет задач
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((item) => (
        <div 
          key={item.task.id} 
          className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-medium text-slate-900">{item.task.name}</p>
              <p className="text-sm text-slate-500 mt-1">
                Проект: {item.project.name}
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                {item.task.progress}%
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openProgressDialog(item)}
              >
                Обновить
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-slate-700 mt-2">
            {item.task.description}
          </p>
          
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${item.task.progress}%` }}
            ></div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Цена: {item.task.price} ₽
            </span>
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
              Время: {item.task.estimatedTime} ч
            </span>
            {item.task.actualStartDate && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Начато: {new Date(item.task.actualStartDate).toLocaleDateString()}
              </span>
            )}
            {item.task.actualEndDate && (
              <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded">
                Завершено: {new Date(item.task.actualEndDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Обновление прогресса задачи</DialogTitle>
            <DialogDescription>
              Укажите текущий процент выполнения задачи "{selectedTask?.task.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span>Прогресс:</span>
              <span className="font-medium">{progressValue[0]}%</span>
            </div>
            <Slider
              value={progressValue}
              onValueChange={setProgressValue}
              max={100}
              step={5}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleUpdateProgress}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeTaskList;
