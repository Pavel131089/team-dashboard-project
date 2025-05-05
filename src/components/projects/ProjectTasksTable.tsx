import React from "react";
import { Project, Task } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface ProjectTasksTableProps {
  project: Project;
  userRole: "manager" | "employee";
  formatDate: (dateString: string | null) => string;
  getAssignedUserName: (assignedTo: string | string[] | null | undefined) => string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
}

const ProjectTasksTable: React.FC<ProjectTasksTableProps> = ({
  project,
  userRole,
  formatDate,
  getAssignedUserName,
  onTaskUpdate,
  onDeleteTask
}) => {
  return (
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
                {task.price ? `${task.price} ¢` : "—"}
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
                      onTaskUpdate(project.id, updatedTask);
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
                    onClick={() => onDeleteTask(project.id, task.id)}
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
  );
};

export default ProjectTasksTable;