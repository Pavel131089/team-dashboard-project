
import React from "react";
import Icon from "@/components/ui/icon";

interface StorageCounterProps {
  title: string;
  count: number;
  status: "idle" | "syncing" | "success" | "error";
}

/**
 * Компонент для отображения счетчика записей в хранилище
 */
const StorageCounter: React.FC<StorageCounterProps> = ({ 
  title, 
  count, 
  status 
}) => {
  const getStatusIcon = (status: string) => {
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

export default StorageCounter;
