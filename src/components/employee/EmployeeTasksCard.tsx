
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeeTaskList from "@/components/EmployeeTaskList";
import { Task } from "@/types/project";

interface EmployeeTasksCardProps {
  userTasks: {project: any, task: Task}[];
  userId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const EmployeeTasksCard: React.FC<EmployeeTasksCardProps> = ({ 
  userTasks, 
  userId, 
  onTaskUpdate 
}) => {
  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    // Если задача завершена на 100%, устанавливаем actualEndDate
    if (updatedTask.progress === 100 && !updatedTask.actualEndDate) {
      updatedTask.actualEndDate = new Date().toISOString();
    }
    onTaskUpdate(projectId, updatedTask);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои задачи</CardTitle>
        <CardDescription>
          Задачи, назначенные на вас
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeTaskList 
          tasks={userTasks} 
          userId={userId}
          onTaskUpdate={handleTaskUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default EmployeeTasksCard;
