
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ProjectActionsProps {
  projectId: string;
  tasksCount: number;
  onDeleteProject: (projectId: string) => void;
  userRole: "manager" | "employee";
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ 
  projectId, 
  tasksCount, 
  onDeleteProject,
  userRole
}) => {
  return (
    <div className="px-4 py-2 bg-slate-50 border-t border-b">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Задачи проекта</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-500">
            Всего задач: {tasksCount}
          </div>
          {userRole === "manager" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDeleteProject(projectId)}
            >
              <Icon name="Trash2" size={16} className="mr-1" />
              Удалить проект
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
