
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

interface ProjectListProps {
  projects: Project[];
  onProjectsUpdated: (projects: Project[]) => void;
  userRole: "manager" | "employee";
}

const ProjectList = ({ projects, onProjectsUpdated, userRole }: ProjectListProps) => {
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Проекты отсутствуют</p>
        <p className="text-slate-400 text-sm mt-2">
          Импортируйте проекты через вкладку "Импорт данных"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg overflow-hidden">
          <Accordion type="single" collapsible>
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
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Цена (₽)</TableHead>
                        <TableHead>Время (ч)</TableHead>
                        <TableHead>Даты</TableHead>
                        <TableHead>Исполнитель</TableHead>
                        <TableHead>Прогресс</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            <div>{task.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {task.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            {task.assignedTo ? (
                              task.progress === 100 ? (
                                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                  Завершено
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                  В работе
                                </span>
                              )
                            ) : (
                              <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 text-slate-800">
                                Не начато
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{task.price}</TableCell>
                          <TableCell>{task.estimatedTime}</TableCell>
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
                            {task.assignedToNames?.length ? 
                              task.assignedToNames.join(', ') : 
                              (task.assignedTo ? (Array.isArray(task.assignedTo) ? task.assignedTo.join(', ') : task.assignedTo) : "—")}
                          </TableCell>


                          <TableCell>
                            <div className="w-full flex items-center space-x-2">
                              <Progress 
                                value={task.progress} 
                                className="h-2 w-24"
                                indicatorClassName={getProgressColor(task.progress)}
                              />
                              <span className="text-xs">{task.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
