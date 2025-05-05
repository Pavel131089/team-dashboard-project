
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AvailableTasksSection from "./AvailableTasksSection";
import { Project, Task } from "@/types/project";

interface AvailableTasksCardProps {
  projects: Project[];
  userId: string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
}

const AvailableTasksCard: React.FC<AvailableTasksCardProps> = ({ 
  projects, 
  userId, 
  onTaskUpdate 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Доступные задачи</CardTitle>
        <CardDescription>
          Задачи, которые можно взять в работу
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AvailableTasksSection 
          projects={projects} 
          userId={userId}
          onTaskUpdate={onTaskUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default AvailableTasksCard;
