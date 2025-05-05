
import React, { useState } from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import EmptyAvailableTasks from "./EmptyAvailableTasks";
import AvailableTaskItem from "./AvailableTaskItem";

interface AvailableTasksSectionProps {
  projects: Project[];
  userId: string;
  onTaskUpdate: (projectId: string, task: Task) => void;
}

const AvailableTasksSection: React.FC<AvailableTasksSectionProps> = ({ 
  projects, 
  userId,
  onTaskUpdate 
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  
  const availableTasks = collectAvailableTasks(projects, userId);
  
  const handleAssignTask = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId)!;
    const task = project.tasks.find(t => t.id === taskId)!;
    
    // Обновляем assignedTo, сохраняя список исполнителей если он уже существует
    let updatedAssignedTo: string | string[] = userId;
    
    if (task.assignedTo) {
      if (Array.isArray(task.assignedTo)) {
        updatedAssignedTo = [...task.assignedTo, userId];
      } else if (task.assignedTo !== userId) {
        updatedAssignedTo = [task.assignedTo, userId];
      }
    }
    
    const updatedTask: Task = {
      ...task,
      assignedTo: updatedAssignedTo,
      actualStartDate: task.actualStartDate || new Date().toISOString()
    };
    
    onTaskUpdate(projectId, updatedTask);
  };

  const handleAddComment = (projectId: string, taskId: string) => {
    if (!newComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Комментарий не может быть пустым",
        variant: "destructive"
      });
      return;
    }

    const project = projects.find(p => p.id === projectId)!;
    const task = project.tasks.find(t => t.id === taskId)!;
    
    const comments = task.comments || [];
    const updatedTask = {
      ...task,
      comments: [...comments, newComment]
    };
    
    onTaskUpdate(project.id, updatedTask);
    setNewComment("");
    setEditingTaskId(null);
    
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий был успешно добавлен к задаче",
    });
  };
  
  if (availableTasks.length === 0) {
    return <EmptyAvailableTasks />;
  }
  
  return (
    <div className="space-y-4">
      {availableTasks.map(({ project, task }) => (
        <AvailableTaskItem 
          key={task.id}
          project={project}
          task={task}
          editingTaskId={editingTaskId}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          onStartEditing={() => setEditingTaskId(task.id)}
          onCancelEditing={() => {
            setEditingTaskId(null);
            setNewComment("");
          }}
          onAddComment={() => handleAddComment(project.id, task.id)}
          onAssignTask={() => handleAssignTask(project.id, task.id)}
        />
      ))}
    </div>
  );
};

// Вспомогательная функция для сбора доступных задач
const collectAvailableTasks = (projects: Project[], userId: string) => {
  const availableTasks: {project: Project, task: Task}[] = [];
  
  projects.forEach(project => {
    project.tasks.forEach(task => {
      // Показываем задачи без исполнителей или задачи, которые можно взять нескольким исполнителям
      const isAssigned = Array.isArray(task.assignedTo)
        ? task.assignedTo.includes(userId)
        : task.assignedTo === userId;
        
      if (!task.assignedTo || !isAssigned) {
        availableTasks.push({
          project,
          task
        });
      }
    });
  });
  
  return availableTasks;
};

export default AvailableTasksSection;
