
import React from "react";

interface TaskAssigneeCellProps {
  assignedTo: string | string[] | null | undefined;
  assignedToNames?: string[];
  getAssignedUserName: (assignedTo: string | string[] | null | undefined) => string;
}

const TaskAssigneeCell: React.FC<TaskAssigneeCellProps> = ({ 
  assignedTo,
  assignedToNames,
  getAssignedUserName
}) => {
  if (Array.isArray(assignedTo)) {
    return (
      <div>
        <div className="text-xs font-medium mb-1">
          {assignedTo.length} {assignedTo.length > 1 ? 'исполнителей' : 'исполнитель'}:
        </div>
        <ul className="list-disc pl-4 text-xs space-y-0.5">
          {Array.isArray(assignedToNames) && assignedToNames.length > 0 ? 
            assignedToNames.map((name, idx) => (
              <li key={idx}>{name}</li>
            )) : 
            assignedTo.map((id, idx) => (
              <li key={idx}>{getAssignedUserName(id)}</li>
            ))
          }
        </ul>
      </div>
    );
  }
  
  return getAssignedUserName(assignedTo);
};

export default TaskAssigneeCell;
