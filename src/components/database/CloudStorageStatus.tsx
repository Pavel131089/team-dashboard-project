
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import StorageCounter from "./StorageCounter";
import SyncActions from "./SyncActions";

// Типы для состояния синхронизации
interface SyncStatusState {
  status: "idle" | "syncing" | "success" | "error";
  count: number;
}

interface SyncStatusesState {
  users: SyncStatusState;
  projects: SyncStatusState;
}

/**
 * Компонент для отображения статуса облачного хранилища
 */
const CloudStorageStatus: React.FC = () => {
  // Состояние для отслеживания статуса синхронизации
  const [syncStatus, setSyncStatus] = useState<SyncStatusesState>({
    users: { status: "idle", count: 0 },
    projects: { status: "idle", count: 0 }
  });

  // Последняя синхронизация
  const [lastSync, setLastSync] = useState<string | null>(null);
  
  // Проверка данных при загрузке компонента
  useEffect(() => {
    checkDataCount();
  }, []);

  /**
   * Определяет, выполняется ли сейчас синхронизация
   */
  const isSyncing = (): boolean => {
    return (
      syncStatus.users.status === "syncing" ||
      syncStatus.projects.status === "syncing"
    );
  };

  /**
   * Получение количества записей в локальном хранилище
   */
  const checkDataCount = async () => {
    try {
      // Получаем пользователей
      updateSyncStatus("users", "syncing");
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      updateSyncStatus("users", "success", users.length);

      // Получаем проекты
      updateSyncStatus("projects", "syncing");
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);
      updateSyncStatus("projects", "success", projects.length);

      // Обновляем время последней синхронизации
      updateLastSyncTime();

      toast.success("Данные успешно получены из локального хранилища");
    } catch (error) {
      handleSyncError("Не удалось получить данные из хранилища", error);
    }
  };

  /**
   * Имитация синхронизации данных с облаком (загрузка)
   */
  const syncLocalToCloud = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      resetSyncStatuses("syncing");

      toast.info("Имитация синхронизации данных с облачным хранилищем...");

      // Получаем данные из localStorage
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);

      // Имитируем задержку сети
      await simulateNetworkDelay();

      // Обновляем статус после "успешной" синхронизации
      updateSyncStatus("users", "success", users.length);
      updateSyncStatus("projects", "success", projects.length);

      // Создаем резервные копии данных
      createBackups(usersStr, projectsStr);

      // Обновляем время последней синхронизации
      updateLastSyncTime();

      toast.success(
        `Синхронизация завершена. Синхронизировано: ${users.length} пользователей, ${projects.length} проектов`
      );
    } catch (error) {
      handleSyncError("Не удалось синхронизировать данные", error);
    }
  };

  /**
   * Имитация загрузки данных из облачного хранилища
   */
  const syncCloudToLocal = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      resetSyncStatuses("syncing");

      toast.info("Имитация загрузки данных из облачного хранилища...");

      // Имитируем задержку сети
      await simulateNetworkDelay();

      // Проверяем наличие резервных копий
      if (await restoreFromBackups()) {
        updateLastSyncTime();
      } else {
        // Если нет резервных копий, сообщаем об этом
        toast.error("Нет данных для восстановления из облачного хранилища");
        resetSyncStatuses("error");
      }
    } catch (error) {
      handleSyncError("Не удалось загрузить данные из облачного хранилища", error);
    }
  };

  /**
   * Обновляет статус синхронизации для указанного типа данных
   */
  const updateSyncStatus = (
    type: "users" | "projects", 
    status: "idle" | "syncing" | "success" | "error", 
    count: number = 0
  ) => {
    setSyncStatus(prev => ({
      ...prev,
      [type]: { status, count }
    }));
  };

  /**
   * Сбрасывает статусы синхронизации обоих типов данных
   */
  const resetSyncStatuses = (status: "idle" | "syncing" | "success" | "error") => {
    setSyncStatus({
      users: { status, count: 0 },
      projects: { status, count: 0 }
    });
  };

  /**
   * Обновляет время последней синхронизации
   */
  const updateLastSyncTime = () => {
    setLastSync(new Date().toLocaleString());
  };

  /**
   * Имитирует задержку сети
   */
  const simulateNetworkDelay = (): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  /**
   * Создает резервные копии данных
   */
  const createBackups = (usersStr: string, projectsStr: string) => {
    localStorage.setItem("cloud_users_backup", usersStr);
    localStorage.setItem("cloud_projects_backup", projectsStr);
  };

  /**
   * Восстанавливает данные из резервных копий
   */
  const restoreFromBackups = async (): Promise<boolean> => {
    const usersBackup = localStorage.getItem("cloud_users_backup");
    const projectsBackup = localStorage.getItem("cloud_projects_backup");

    if (usersBackup && projectsBackup) {
      // Восстанавливаем данные из резервных копий
      localStorage.setItem("users", usersBackup);
      localStorage.setItem("projects", projectsBackup);

      const users = JSON.parse(usersBackup);
      const projects = JSON.parse(projectsBackup);

      // Обновляем статус
      updateSyncStatus("users", "success", users.length);
      updateSyncStatus("projects", "success", projects.length);

      toast.success(
        `Данные загружены из облачного хранилища: ${users.length} пользователей, ${projects.length} проектов`
      );
      return true;
    }
    return false;
  };

  /**
   * Обрабатывает ошибки синхронизации
   */
  const handleSyncError = (message: string, error: any) => {
    console.error(`${message}:`, error);
    resetSyncStatuses("error");
    toast.error(message);
  };

  // Получаем общий статус синхронизации
  const getSyncOverallStatus = (): "idle" | "syncing" | "success" | "error" => {
    if (syncStatus.users.status === "error" || syncStatus.projects.status === "error") {
      return "error";
    }
    if (syncStatus.users.status === "syncing" || syncStatus.projects.status === "syncing") {
      return "syncing";
    }
    if (syncStatus.users.status === "success" || syncStatus.projects.status === "success") {
      return "success";
    }
    return "idle";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Синхронизация данных</span>
          <StatusBadge status={getSyncOverallStatus()} />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StorageCounter 
            title="Пользователи" 
            count={syncStatus.users.count} 
            status={syncStatus.users.status} 
          />
          <StorageCounter 
            title="Проекты" 
            count={syncStatus.projects.count} 
            status={syncStatus.projects.status} 
          />
        </div>

        <SyncActions 
          isSyncing={isSyncing()}
          onRefreshStats={checkDataCount}
          onUploadToCloud={syncLocalToCloud}
          onDownloadFromCloud={syncCloudToLocal}
        />

        {lastSync && (
          <div className="text-xs text-slate-500 text-center mt-2">
            Последняя синхронизация: {lastSync}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CloudStorageStatus;
