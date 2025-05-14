
import React, { useEffect, useState } from "react";
import { getUserNameById, getUserNamesByIds, getAssigneeNames } from "@/utils/userUtils";

interface TaskAssigneeCellProps {
  assignedTo: string | string[] | null | undefined;
  assignedToNames?: string[];
}

/**
 * Компонент для отображения исполнителей задачи
 * Получает и отображает ФИО пользователей вместо ID
 */
const TaskAssigneeCell: React.FC<TaskAssigneeCellProps> = ({ 
  assignedTo,
  assignedToNames
}) => {
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  
  // Получаем имена исполнителей при монтировании компонента
  useEffect(() => {
    if (!assignedTo) {
      setDisplayNames([]);
      return;
    }
    
    // Если уже есть имена в assignedToNames, используем их
    if (assignedToNames && assignedToNames.length > 0) {
      setDisplayNames(assignedToNames);
      return;
    }
    
    // Иначе получаем имена по ID
    if (Array.isArray(assignedTo)) {
      const names = getUserNamesByIds(assignedTo);
      setDisplayNames(names);
    } else {
      const name = getUserNameById(assignedTo);
      setDisplayNames([name]);
    }
  }, [assignedTo, assignedToNames]);
  
  if (!assignedTo) {
    return <span className="text-slate-400">Не назначено</span>;
  }
  
  // Если это один исполнитель, просто отображаем его имя
  if (displayNames.length === 1) {
    return <span>{displayNames[0]}</span>;
  }
  
  // Если исполнителей несколько, отображаем список
  return (
    <div>
      <div className="text-xs font-medium mb-1">
        {displayNames.length} {displayNames.length > 1 ? 'исполнителей' : 'исполнитель'}:
      </div>
      <ul className="list-disc pl-4 text-xs space-y-0.5">
        {displayNames.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskAssigneeCell;
