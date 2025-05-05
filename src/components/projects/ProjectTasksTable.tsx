
import React from "react";
import { Project, Task } from "@/types/project";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskTableRow from "./TaskTableRow";

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
            <TaskTableRow
              key={task.id}
              task={task}
              project={project}
              userRole={userRole}
              formatDate={formatDate}
              getAssignedUserName={getAssignedUserName}
              onTaskUpdate={onTaskUpdate}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTasksTable;
