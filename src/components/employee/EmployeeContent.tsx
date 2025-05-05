
import React from "react";
import { Project, Task, User } from "@/types/project";
import EmployeeLayout from "./EmployeeLayout";
import EmployeeTasksCard from "./EmployeeTasksCard";
import AvailableTasksCard from "./AvailableTasksCard";

interface EmployeeContentProps {
  user: User;
  projects: Project[];
  userTasks: { project: Project; task: Task }[];
  onTaskUpdate: (projectId: string, task: Task) => void;
  onLogout: () => void;
}

const EmployeeContent: React.FC<EmployeeContentProps> = ({
  user,
  projects,
  userTasks,
  onTaskUpdate,
  onLogout
}) => {
  return (
    <EmployeeLayout userName={user.username} onLogout={onLogout}>
      <div className="grid grid-cols-1 gap-6">
        <EmployeeTasksCard 
          userTasks={userTasks} 
          userId={user.id}
          onTaskUpdate={onTaskUpdate}
        />
        
        <AvailableTasksCard 
          projects={projects} 
          userId={user.id}
          onTaskUpdate={onTaskUpdate}
        />
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeContent;
