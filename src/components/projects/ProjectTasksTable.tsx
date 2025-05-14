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

// Find section: ProjectTasksTable component
const ProjectTasksTable: React.FC<ProjectTasksTableProps> = ({
  project,
  userRole,
  formatDate,
  getAssignedUserName,
  onTaskUpdate,
  onDeleteTask,
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

// ... keep existing code below
export default ProjectTasksTable;
