
import React from "react";
import { Badge } from "@/components/ui/badge";

type Status = "idle" | "syncing" | "success" | "error";

interface StatusBadgeProps {
  status: Status;
}

/**
 * Компонент для отображения статуса синхронизации
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = (status: Status) => {
    switch (status) {
      case "idle":
        return "bg-slate-100 text-slate-800";
      case "syncing":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case "idle":
        return "Не синхронизировано";
      case "syncing":
        return "Синхронизация...";
      case "success":
        return "Синхронизировано";
      case "error":
        return "Ошибка синхронизации";
      default:
        return "Неизвестный статус";
    }
  };

  return (
    <Badge
      variant="outline"
      className={getBadgeStyles(status)}
    >
      {getStatusText(status)}
    </Badge>
  );
};

export default StatusBadge;
