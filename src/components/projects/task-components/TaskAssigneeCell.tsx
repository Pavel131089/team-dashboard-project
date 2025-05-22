
import React, { useEffect, useState } from "react";
import { getAssigneeNames } from "@/utils/userUtils";

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
  const [displayNames, setDisplayNames] = useState<string>("Не назначено");
  
  // Получаем имена исполнителей при монтировании компонента
  useEffect(() => {
    // Приоритет: сначала проверяем assignedToNames (имена), затем assignedTo (ID)
    if (assignedToNames && assignedToNames.length > 0) {
      setDisplayNames(getAssigneeNames(assignedToNames));
      return;
    }
    
    if (!assignedTo) {
      setDisplayNames("Не назначено");
      return;
    }
    
    // Обрабатываем assignedTo (может быть строкой или массивом)
    if (Array.isArray(assignedTo)) {
      if (assignedTo.length === 0) {
        setDisplayNames("Не назначено");
        return;
      }
      
      // Получаем имена для ID в массиве
      const names = getAssigneeNames(assignedTo);
      setDisplayNames(names);
    } else {
      // Получаем имя для одного ID
      const name = getAssigneeNames([assignedTo]);
      setDisplayNames(name);
    }
  }, [assignedTo, assignedToNames]);
  
  if (displayNames === "Не назначено") {
    return <span className="text-slate-400">Не назначено</span>;
  }
  
  // Проверяем, есть ли запятая в строке (несколько исполнителей)
  if (displayNames.includes(',')) {
    const nameList = displayNames.split(',').map(name => name.trim());
    
    return (
      <div>
        <div className="text-xs font-medium mb-1">
          {nameList.length} {nameList.length > 1 ? 'исполнителей' : 'исполнитель'}:
        </div>
        <ul className="list-disc pl-4 text-xs space-y-0.5">
          {nameList.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Если один исполнитель, просто отображаем его имя
  return <span>{displayNames}</span>;
};

export default TaskAssigneeCell;
