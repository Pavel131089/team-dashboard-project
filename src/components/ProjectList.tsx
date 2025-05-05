
import { useState } from "react";
import { Project } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import ProjectItem from "@/components/projects/ProjectItem";
import ProjectDialogs from "@/components/projects/ProjectDialogs";
import EmptyProjectsList from "@/components/projects/EmptyProjectsList";
import { formatDate, getAssignedUserName } from "@/components/utils/FormatUtils";

interface User {
  id: string;
  username: string;
}

interface ProjectListProps {
  projects: Project[];
  onProjectsUpdated?: (projects: Project[]) => void;
  userRole?: "manager" | "employee";
  onUpdateProject?: (updatedProject: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  users?: User[];
}

const ProjectList = ({ 
  projects, 
  onProjectsUpdated, 
  userRole = "manager",
  onUpdateProject,
  onDeleteProject,
  users = []
}: ProjectListProps) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{projectId: string, taskId: string} | null>(null);
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);

  const handleExpandToggle = (projectId: string | null) => {
    setExpandedProject(projectId);
  };

  const handleDeleteProjectClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteProjectDialogOpen(true);
  };

  const handleDeleteTaskClick = (projectId: string, taskId: string) => {
    setTaskToDelete({ projectId, taskId });
    setIsDeleteTaskDialogOpen(true);
  };
  
  const confirmDeleteProject = () => {
    if (projectToDelete) {
      if (onDeleteProject) {
        onDeleteProject(projectToDelete);
      } else if (onProjectsUpdated) {
        const updatedProjects = projects.filter(p => p.id !== projectToDelete);
        onProjectsUpdated(updatedProjects);
      }
      
      toast({
        title: "Проект удален",
        description: "Проект и все его задачи были успешно удалены"
      });
      setIsDeleteProjectDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const { projectId, taskId } = taskToDelete;
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId)
          };
        }
        return project;
      });
      
      if (onUpdateProject) {
        const updatedProject = updatedProjects.find(p => p.id === projectId);
        if (updatedProject) {
          onUpdateProject(updatedProject);
        }
      } else if (onProjectsUpdated) {
        onProjectsUpdated(updatedProjects);
      }
      
      toast({
        title: "Задача удалена",
        description: "Задача была успешно удалена из проекта"
      });
    }
    setIsDeleteTaskDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleTaskUpdate = (projectId: string, updatedTask: any) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });

    if (onUpdateProject) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      if (updatedProject) {
        onUpdateProject(updatedProject);
      }
    } else if (onProjectsUpdated) {
      onProjectsUpdated(updatedProjects);
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    } else if (onProjectsUpdated) {
      const updatedProjects = projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      );
      onProjectsUpdated(updatedProjects);
    }
  };

  const getFormattedUserName = (assignedTo: string | string[] | null | undefined) => {
    if (users && users.length > 0) {
      return getAssignedUserName(assignedTo, users);
    }
    return getAssignedUserName(assignedTo);
  };

  if (projects.length === 0) {
    return <EmptyProjectsList />;
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isExpanded={expandedProject === project.id}
          onExpandToggle={handleExpandToggle}
          userRole={userRole}
          formatDate={formatDate}
          getAssignedUserName={getFormattedUserName}
          onTaskUpdate={handleTaskUpdate}
          onProjectUpdate={handleProjectUpdate}
          onDeleteTask={handleDeleteTaskClick}
          onDeleteProject={handleDeleteProjectClick}
        />
      ))}

      <ProjectDialogs
        isDeleteProjectDialogOpen={isDeleteProjectDialogOpen}
        isDeleteTaskDialogOpen={isDeleteTaskDialogOpen}
        onCloseProjectDialog={() => setIsDeleteProjectDialogOpen(false)}
        onCloseTaskDialog={() => setIsDeleteTaskDialogOpen(false)}
        onConfirmDeleteProject={confirmDeleteProject}
        onConfirmDeleteTask={confirmDeleteTask}
      />
    </div>
  );
};

export default ProjectList;
