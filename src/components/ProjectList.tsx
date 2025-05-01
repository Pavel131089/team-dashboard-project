
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

interface User {
  id: string;
  username: string;
}

interface ProjectListProps {
  projects: Project[];
  onProjectsUpdated?: (projects: Project[]) => void;
  userRole?: "manager" | "employee";
  onUpdateProject?: (updatedProject: Project) => void;
  users?: User[];
}

const ProjectList = ({ 
  projects, 
  onProjectsUpdated, 
  userRole = "manager",
  onUpdateProject,
  users = []
}: ProjectListProps) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
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
                    <div className="text-sm text-slate-500">
                      Всего задач: {project.tasks.length}
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
                  {Array.isArray(task.assignedToNames) && task.assignedToNames.length > 0 ? (
                    <div className="space-y-1">
                      {task.assignedToNames.map((name, idx) => (
                        <Badge key={idx} variant="secondary" className="mr-1">{name}</Badge>
                      ))}
                    </div>
                  ) : task.assignedTo ? (
                    <div>{typeof task.assignedTo === 'string' ? task.assignedTo : '—'}</div>
                  ) : (
                    "—"
                  )}
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
                            </TableCell>
                            <TableCell>
                              {getAssignedUserName(task.assignedTo)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Progress 
                                  value={task.progress || 0} 
                                  className={getProgressColor(task.progress || 0)}
                                />
                                <span className="text-xs">{task.progress || 0}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
    </div>
  );
};

export default ProjectList;
