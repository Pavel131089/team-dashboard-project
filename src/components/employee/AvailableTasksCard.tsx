import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task } from "@/types/project";
import AvailableTasksSection from "./AvailableTasksSection";
import Icon from "@/components/ui/icon";

interface AvailableTasksCardProps {
  projects: Project[];
  userId: string;
  onTaskUpdate: (projectId: string, task: Task) => void;
}

const AvailableTasksCard: React.FC<AvailableTasksCardProps> = ({
  projects,
  userId,
  onTaskUpdate,
}) => {
  // Обработчик взятия задачи в работу
  const handleTaskAssignment = (projectId: string, task: Task) => {
    // Вызываем родительский обработчик
    onTaskUpdate(projectId, task);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Icon name="Briefcase" className="h-5 w-5 text-primary" />
          Доступные задачи
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Задачи, которые можно взять в работу
        </p>
      </CardHeader>
      <CardContent>
        <AvailableTasksSection
          projects={projects}
          userId={userId}
          onTaskUpdate={handleTaskAssignment}
        />
      </CardContent>
    </Card>
  );
};

export default AvailableTasksCard;
