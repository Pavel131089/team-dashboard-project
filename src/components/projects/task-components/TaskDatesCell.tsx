
import React from "react";

interface TaskDatesCellProps {
  startDate: string | null;
  endDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
  formatDate: (dateString: string | null) => string;
}

const TaskDatesCell: React.FC<TaskDatesCellProps> = ({
  startDate,
  endDate,
  actualStartDate,
  actualEndDate,
  formatDate
}) => {
  return (
    <div className="text-xs">
      <div>План: {formatDate(startDate)} — {formatDate(endDate)}</div>
      {actualStartDate && (
        <div className="mt-1">
          Факт: {formatDate(actualStartDate)}
          {actualEndDate ? ` — ${formatDate(actualEndDate)}` : ""}
        </div>
      )}
    </div>
  );
};

export default TaskDatesCell;
