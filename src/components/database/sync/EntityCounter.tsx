
import React from "react";
import { SyncStatus } from "../hooks/useDataSync";
import Icon from "@/components/ui/icon";

interface EntityCounterProps {
  title: string;
  count: number;
  status: SyncStatus;
}

/**
 * Компонент для отображения счетчика сущностей с статусом синхронизации
 */
const EntityCounter: React.FC<EntityCounterProps> = ({ 
  title, 
  count, 
  status 
}) => {
  // Определяем иконку в зависимости от статуса
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <Icon name="CheckCircle" className="h-4 w-4 text-green-500" />;
      case "error":
        return <Icon name="XCircle" className="h-4 w-4 text-red-500" />;
      case "syncing":
        return <Icon name="RefreshCw" className="h-4 w-4 text-blue-500 animate-spin" />;
      case "idle":
      default:
        return <Icon name="Circle" className="h-4 w-4 text-slate-300" />;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="font-medium text-sm">{title}</h3>
        {getStatusIcon()}
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default EntityCounter;
