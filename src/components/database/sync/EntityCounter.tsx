
import React from "react";
import Icon from "@/components/ui/icon";
import { SyncStatusType } from "./SyncStatusBadge";

interface EntityCounterProps {
  title: string;
  count: number;
  status: SyncStatusType;
}

/**
 * Компонент для отображения счетчика записей в хранилище
 * @param title - Название типа данных
 * @param count - Количество записей
 * @param status - Статус синхронизации
 */
const EntityCounter: React.FC<EntityCounterProps> = ({ 
  title, 
  count, 
  status 
}) => {
  /**
   * Возвращает иконку в зависимости от статуса
   */
  const getStatusIcon = (status: SyncStatusType) => {
    switch (status) {
      case "idle":
        return <Icon name="CircleDashed" className="text-slate-400" />;
      case "syncing":
        return <Icon name="RefreshCw" className="animate-spin text-blue-500" />;
      case "success":
        return <Icon name="CheckCircle" className="text-green-500" />;
      case "error":
        return <Icon name="XCircle" className="text-red-500" />;
      default:
        return <Icon name="CircleDashed" className="text-slate-400" />;
    }
  };

  return (
    <div className="p-3 border rounded-md bg-slate-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{title}</span>
        {getStatusIcon(status)}
      </div>
      <div className="text-2xl font-semibold">{count}</div>
      <div className="text-xs text-slate-500">записей в хранилище</div>
    </div>
  );
};

export default EntityCounter;
