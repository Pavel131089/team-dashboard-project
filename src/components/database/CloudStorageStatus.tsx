
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import SyncActions from "./SyncActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

/**
 * Компонент для отображения статуса облачного хранилища
 * и управления синхронизацией
 */
const CloudStorageStatus: React.FC = () => {
  // Состояние синхронизации
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [counters, setCounters] = useState({
    users: 0,
    projects: 0
  });
  
  // Эффект для загрузки начальных данных
  useEffect(() => {
    loadStorageStats();
    // Проверяем, было ли сохранено время последней синхронизации
    const savedLastSync = localStorage.getItem('lastSyncTime');
    if (savedLastSync) {
      setLastSync(savedLastSync);
    }
  }, []);

  /**
   * Загружает статистику хранилища
   */
  const loadStorageStats = () => {
    try {
      // Получаем данные из локального хранилища
      const usersStr = localStorage.getItem("users") || "[]";
      const projectsStr = localStorage.getItem("projects") || "[]";
      
      // Парсим данные
      const users = JSON.parse(usersStr);
      const projects = JSON.parse(projectsStr);
      
      // Обновляем счетчики
      setCounters({
        users: Array.isArray(users) ? users.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0
      });
      
      // Обновляем статус если ранее была ошибка
      if (syncStatus === "error") {
        setSyncStatus("idle");
      }
    } catch (error) {
      console.error("Ошибка при загрузке статистики:", error);
      setSyncStatus("error");
    }
  };

  /**
   * Имитирует синхронизацию данных с облаком
   */
  const syncWithCloud = (direction: "upload" | "download") => {
    // Устанавливаем статус синхронизации
    setSyncStatus("syncing");
    
    // Имитация задержки сетевого запроса
    setTimeout(() => {
      try {
        if (direction === "upload") {
          // Имитация загрузки в облако
          console.log("Имитация загрузки данных в облако...");
        } else {
          // Имитация загрузки из облака
          console.log("Имитация загрузки данных из облака...");
        }
        
        // Обновляем статус и время синхронизации
        setSyncStatus("success");
        const now = new Date().toLocaleString();
        setLastSync(now);
        localStorage.setItem('lastSyncTime', now);
        
        // Обновляем статистику
        loadStorageStats();
      } catch (error) {
        console.error("Ошибка при синхронизации:", error);
        setSyncStatus("error");
      }
    }, 2000); // Имитация задержки сети
  };

  /**
   * Обработчики действий
   */
  const handleRefreshStats = loadStorageStats;
  const handleUploadToCloud = () => syncWithCloud("upload");
  const handleDownloadFromCloud = () => syncWithCloud("download");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Синхронизация данных</span>
          <StatusBadge status={syncStatus} />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Счетчики сущностей */}
        <div className="grid grid-cols-2 gap-4">
          <StorageCounter title="Пользователи" count={counters.users} />
          <StorageCounter title="Проекты" count={counters.projects} />
        </div>

        {/* Кнопки действий */}
        <SyncActions
          isSyncing={syncStatus === "syncing"}
          onRefreshStats={handleRefreshStats}
          onUploadToCloud={handleUploadToCloud}
          onDownloadFromCloud={handleDownloadFromCloud}
        />

        {/* Информация о синхронизации */}
        {syncStatus === "success" && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Icon name="CheckCircle" className="h-4 w-4" />
            <AlertTitle>Синхронизация выполнена успешно</AlertTitle>
            <AlertDescription>
              Данные успешно синхронизированы с облаком.
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === "error" && (
          <Alert variant="destructive">
            <Icon name="AlertTriangle" className="h-4 w-4" />
            <AlertTitle>Ошибка синхронизации</AlertTitle>
            <AlertDescription>
              Не удалось выполнить синхронизацию. Пожалуйста, попробуйте позже.
            </AlertDescription>
          </Alert>
        )}

        {/* Время последней синхронизации */}
        {lastSync && (
          <div className="text-xs text-slate-500 text-center mt-2">
            Последняя синхронизация: {lastSync}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Компонент для отображения счетчика сущностей
 */
const StorageCounter: React.FC<{ title: string; count: number }> = ({ 
  title, 
  count 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
      <Icon 
        name={title === "Пользователи" ? "Users" : "FolderKanban"} 
        className="h-8 w-8 mb-2 text-slate-500" 
      />
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default CloudStorageStatus;
