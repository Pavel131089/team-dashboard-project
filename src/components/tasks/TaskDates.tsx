interface TaskDatesProps {
  startDate: string | null;
  endDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
}

/**
 * Форматирует дату в локальный формат
 */
const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString();
};

/**
 * Компонент для отображения плановых и фактических дат задачи
 */
const TaskDates = ({ 
  startDate, 
  endDate, 
  actualStartDate, 
  actualEndDate 
}: TaskDatesProps) => {
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

export default TaskDates;