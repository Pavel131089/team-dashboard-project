
import React from "react";
import { Project } from "@/types/project";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectActions from "@/components/projects/ProjectActions";
import ProjectTasksTable from "@/components/projects/ProjectTasksTable";
import ProjectTaskEditor from "@/components/ui/project-task-editor";

interface ProjectItemProps {
  project: Project;
  isExpanded: boolean;
  onExpandToggle: (value: string | null) => void;
  userRole: "manager" | "employee";
  formatDate: (dateString: string | null) => string;
  getAssignedUserName: (assignedTo: string | string[] | null | undefined) => string;
  onTaskUpdate: (projectId: string, updatedTask: any) => void;
  onProjectUpdate: (updatedProject: Project) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isExpanded,
  onExpandToggle,
  userRole,
  formatDate,
  getAssignedUserName,
  onTaskUpdate,
  onProjectUpdate,
  onDeleteTask,
  onDeleteProject
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Accordion 
        type="single" 
        collapsible
        value={isExpanded ? project.id : undefined}
        onValueChange={(value) => onExpandToggle(value || null)}
      >
        <AccordionItem value={project.id}>
          <ProjectHeader project={project} />
          <AccordionContent>
            <ProjectActions 
              projectId={project.id}
              tasksCount={project.tasks.length}
              onDeleteProject={onDeleteProject}
              userRole={userRole}
            />
            <ProjectTasksTable 
              project={project}
              userRole={userRole}
              formatDate={formatDate}
              getAssignedUserName={getAssignedUserName}
              onTaskUpdate={onTaskUpdate}
              onDeleteTask={onDeleteTask}
            />
            {userRole === "manager" && (
              <ProjectTaskEditor 
                project={project} 
                onProjectUpdate={onProjectUpdate} 
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProjectItem;
