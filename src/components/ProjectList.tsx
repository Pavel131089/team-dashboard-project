import { useState } from "react";
import { Project, Task } from "@/types/project";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import ProjectTaskEditor from "@/components/ui/project-task-editor";
import DeleteConfirmationDialog from "@/components/ui/delete-confirmation-dialog";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectActions from "@/components/projects/ProjectActions";
import ProjectTasksTable from "@/components/projects/ProjectTasksTable";

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
      } else {
        const updatedProjects = projects.filter(p => p.id !== projectToDelete);
        if (onProjectsUpdated) {
          onProjectsUpdated(updatedProjects);
        }
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

// ... keep existing code 
  const getAssignedUserName = (assignedTo: string | string[] | null | undefined) => {
    if (!assignedTo) return "—";
    
    const findUserById = (id: string) => {
      const user = users?.find(u => u.id === id);
      return user ? user.username : id;
    };

    if (Array.isArray(assignedTo)) {
      return assignedTo.map(id => findUserById(id)).join(", ");
    }
    
    return findUserById(assignedTo);
  };
// ... keep existing code 
  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
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

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Проекты отсутствуют</p>
        <p className="text-slate-400 text-sm mt-2">
          Создайте новый проект или импортируйте существующие через вкладку "Импорт данных"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg overflow-hidden">
          <Accordion 
            type="single" 
            collapsible
            value={expandedProject === project.id ? project.id : undefined}
            onValueChange={(value) => setExpandedProject(value || null)}
          >
            <AccordionItem value={project.id}>
              <ProjectHeader project={project} />
              <AccordionContent>
                <ProjectActions 
                  projectId={project.id}
                  tasksCount={project.tasks.length}
                  onDeleteProject={handleDeleteProjectClick}
                  userRole={userRole}
                />
                <ProjectTasksTable 
                  project={project}
                  userRole={userRole}
                  formatDate={formatDate}
                  getAssignedUserName={getAssignedUserName}
                  onTaskUpdate={handleTaskUpdate}
                  onDeleteTask={handleDeleteTaskClick}
                />
                {userRole === "manager" && (
                  <ProjectTaskEditor 
                    project={project} 
                    onProjectUpdate={handleProjectUpdate} 
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}

      {/* Диалог подтверждения удаления проекта */}
      <DeleteConfirmationDialog
        isOpen={isDeleteProjectDialogOpen}
        onClose={() => setIsDeleteProjectDialogOpen(false)}
        onConfirm={confirmDeleteProject}
        title="Удалить проект"
        description="Вы уверены, что хотите удалить проект? Это действие нельзя отменить. Все задачи, связанные с этим проектом, также будут удалены."
      />

      {/* Диалог подтверждения удаления задачи */}
      <DeleteConfirmationDialog
        isOpen={isDeleteTaskDialogOpen}
        onClose={() => setIsDeleteTaskDialogOpen(false)}
        onConfirm={confirmDeleteTask}
        title="Удалить задачу"
        description="Вы уверены, что хотите удалить задачу? Это действие нельзя отменить."
      />
    </div>
  );
};

export default ProjectList;