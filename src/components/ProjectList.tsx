
import { useState } from "react";
import { Project, Task } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import ProjectTaskEditor from "@/components/ui/project-task-editor";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmationDialog from "@/components/ui/delete-confirmation-dialog";
import Icon from "@/components/ui/icon";

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

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";

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

  const getAssignedUserName = (assignedTo: string | string[] | null | undefined) => {
    if (!assignedTo) return "—";
    
    if (Array.isArray(assignedTo)) {
      return assignedTo.map(id => {
        const user = users?.find(u => u.id === id);
        return user ? user.username : id;
      }).join(", ");
    }
    
    // Если строка
    const user = users?.find(u => u.id === assignedTo);
    return user ? user.username : assignedTo;
  };

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
              <AccordionTrigger className="px-4 py-3 hover:bg-slate-50">
                <div className="flex-1 text-left">
                  <span className="font-medium text-slate-900">{project.name}</span>
                  <div className="text-sm text-slate-500 font-normal mt-1">
                    {project.description}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 py-2 bg-slate-50 border-t border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Задачи проекта</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-500">
                        Всего задач: {project.tasks.length}
                      </div>
                      {userRole === "manager" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteProjectClick(project.id)}
                        >
                          <Icon name="Trash2" size={16} className="mr-1" />
                          Удалить проект
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Стоимость</TableHead>
                        <TableHead>Время</TableHead>
                        <TableHead>Даты</TableHead>
                        <TableHead>Исполнитель</TableHead>
                        <TableHead>Прогресс</TableHead>
                        {userRole === "manager" && <TableHead>Действия</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="font-medium">{task.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{task.description}</div>
                            {task.comments && task.comments.length > 0 && (
                              <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                                <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
                                <ul className="list-disc pl-4 space-y-1">
                                  {task.comments.map((comment, index) => (
                                    <li key={index} className="text-gray-600">{comment}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {task.progress === 100 ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                Завершено
                              </Badge>
                            ) : task.assignedTo ? (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                В работе
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                Ожидает
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {task.price ? `${task.price} ₽` : "—"}
                          </TableCell>
                          <TableCell>
                            {task.estimatedTime ? `${task.estimatedTime} ч` : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>План: {formatDate(task.startDate)} — {formatDate(task.endDate)}</div>
                              {task.actualStartDate && (
                                <div className="mt-1">
                                  Факт: {formatDate(task.actualStartDate)} 
                                  {task.actualEndDate ? ` — ${formatDate(task.actualEndDate)}` : ""}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getAssignedUserName(task.assignedTo)}
                          </TableCell>
                          <TableCell>
                            <div className="w-full flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <Progress 
                                  value={task.progress || 0} 
                                  className="h-2 w-24"
                                  indicatorClassName={
                                    task.progress < 30 ? "bg-red-500" :
                                    task.progress < 70 ? "bg-yellow-500" :
                                    "bg-green-500"
                                  }
                                />
                                <span className="text-xs">{task.progress || 0}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                step="5"
                                value={task.progress || 0}
                                onChange={(e) => {
                                  const updatedTask = {
                                    ...task,
                                    progress: parseInt(e.target.value)
                                  };
                                  if (updatedTask.progress === 100 && !updatedTask.actualEndDate) {
                                    updatedTask.actualEndDate = new Date().toISOString();
                                  }
                                  handleTaskUpdate(project.id, updatedTask);
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </TableCell>
                          {userRole === "manager" && (
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTaskClick(project.id, task.id)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
