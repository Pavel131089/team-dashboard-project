
import React, { useState } from "react";
import { Project, Task } from "@/types/project";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import TaskStatus from "./task-components/TaskStatus";
import TaskDetails from "./task-components/TaskDetails";
import TaskDatesCell from "./task-components/TaskDatesCell";
import TaskAssigneeCell from "./task-components/TaskAssigneeCell";
import TaskProgressCell from "./task-components/TaskProgressCell";
import TaskCommentSection from "./task-components/TaskCommentSection";

interface TaskTableRowProps {
  task: Task;
  project: Project;
  userRole: "manager" | "employee";
  formatDate: (dateString: string | null) => string;
  getAssignedUserName: (assignedTo: string | string[] | null | undefined) => string;
  onTaskUpdate: (projectId: string, updatedTask: Task) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
}

const TaskTableRow: React.FC<TaskTableRowProps> = ({
  task,
  project,
  userRole,
  formatDate,
  getAssignedUserName,
  onTaskUpdate,
  onDeleteTask
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast("Комментарий не может быть пустым");
      return;
    }

    const comments = task.comments || [];
    const updatedTask = { 
      ...task, 
      comments: [...comments, newComment]
    };
    onTaskUpdate(project.id, updatedTask);
    setNewComment("");
    setEditingTaskId(null);
    
    toast("Комментарий успешно добавлен");
  };

  return (
    <TableRow>
      <TableCell>
        <TaskDetails 
          task={task} 
        />
        
        <TaskCommentSection 
          comments={task.comments}
          isEditing={editingTaskId === task.id}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          onSaveComment={handleAddComment}
          onCancelEdit={() => {
            setEditingTaskId(null);
            setNewComment("");
          }}
          onStartEdit={() => setEditingTaskId(task.id)}
        />
      </TableCell>
      
      <TableCell>
        <TaskStatus progress={task.progress} assignedTo={task.assignedTo} />
      </TableCell>
      
      <TableCell>
        {task.price ? `${task.price} ₽` : "—"}
      </TableCell>
      
      <TableCell>
        {task.estimatedTime ? `${task.estimatedTime} ч` : "—"}
      </TableCell>
      
      <TableCell>
        <TaskDatesCell 
          startDate={task.startDate}
          endDate={task.endDate}
          actualStartDate={task.actualStartDate}
          actualEndDate={task.actualEndDate}
          formatDate={formatDate}
        />
      </TableCell>
      
      <TableCell>
        <TaskAssigneeCell 
          assignedTo={task.assignedTo}
          assignedToNames={task.assignedToNames}
          getAssignedUserName={getAssignedUserName}
        />
      </TableCell>
      
      <TableCell>
        <TaskProgressCell
          progress={task.progress || 0}
          onProgressChange={(progress) => {
            const updatedTask = {
              ...task,
              progress
            };
            if (updatedTask.progress === 100 && !updatedTask.actualEndDate) {
              updatedTask.actualEndDate = new Date().toISOString();
            }
            onTaskUpdate(project.id, updatedTask);
          }}
        />
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
  );
};

export default TaskTableRow;
