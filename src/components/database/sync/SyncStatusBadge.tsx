
import React from "react";
import { Badge } from "@/components/ui/badge";
import { SyncStatus } from "../hooks/useDataSync";
import Icon from "@/components/ui/icon";

interface SyncStatusBadgeProps {
  status: SyncStatus;
}

/**
 * Компонент для отображения статуса синхронизации
 */
const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ status }) => {
  // Определяем стили и содержимое в зависимости от статуса
  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return {
          icon: "CheckCircle",
          text: "Синхронизировано",
          badgeClass: "bg-green-100 text-green-800 border-green-200"
        };
      case "error":
        return {
          icon: "AlertTriangle",
          text: "Ошибка синхронизации",
          badgeClass: "bg-red-100 text-red-800 border-red-200"
        };
      case "syncing":
        return {
          icon: "RefreshCw",
          text: "Синхронизация...",
          badgeClass: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "idle":
      default:
        return {
          icon: "Clock",
          text: "Не синхронизировано",
          badgeClass: "bg-slate-100 text-slate-800 border-slate-200"
        };
    }
  };
  
  const { icon, text, badgeClass } = getStatusStyles();
  
  return (
    <Badge variant="outline" className={`gap-1 px-2 py-1 ${badgeClass}`}>
      <Icon 
        name={icon} 
        className={`h-3.5 w-3.5 ${status === "syncing" ? "animate-spin" : ""}`} 
      />
      <span>{text}</span>
    </Badge>
  );
};

export default SyncStatusBadge;
