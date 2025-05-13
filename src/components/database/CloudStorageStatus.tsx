
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StorageCounter from "./StorageCounter";
import SyncActions from "./SyncActions";
import StatusBadge from "./StatusBadge";

/**
 * Тип для состояния синхронизации сущности
 */
interface SyncState {
  status: "idle" | "syncing" | "success" | "error";
  count: number;
}

/**
 * Типы состояний синхронизации хранилища
 */
interface SyncStatus {
  users: SyncState;
  projects: SyncState;
}

/**
 * Компонент для отображения статуса хранилища данных
 * и управления синхронизацией
 */
const CloudStorageStatus: React.FC = () => {
  // Состояние синхронизации для разных типов данных
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    users: { status: "idle", count: 0 },
    projects: { status: "idle", count: 0 },
  });

  // Время последней синхронизации
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Проверяем количество записей при загрузке компонента
  useEffect(() => {
    checkDataCount();
  }, []);

  /**
   * Получение количества записей в локальном хранилище
   */
  const checkDataCount = async () => {
    try {
      // Получаем пользователей
      updateEntityStatus("users", "syncing");
      const usersCount = getEntityCount("users");
      updateEntityStatus("users", "success", usersCount);

      // Получаем проекты
      updateEntityStatus("projects", "syncing");
      const projectsCount = getEntityCount("projects");
      updateEntityStatus("projects", "success", projectsCount);

      // Обновляем время последней синхронизации
      updateLastSyncTime();

      toast.success("Данные успешно получены из локального хранилища");
    } catch (error) {
      handleSyncError("Не удалось получить данные из хранилища");
    }
  };

  /**
   * Получает количество записей для определенного типа сущности
   */
  const getEntityCount = (entityType: keyof SyncStatus): number => {
    const dataStr = localStorage.getItem(entityType) || "[]";
    const data = JSON.parse(dataStr);
    return Array.isArray(data) ? data.length : 0;
  };

  /**
   * Обновляет статус синхронизации для сущности
   */
  const updateEntityStatus = (
    entityType: keyof SyncStatus,
    status: SyncState["status"],
    count?: number
  ) => {
    setSyncStatus((prev) => ({
      ...prev,
      [entityType]: { 
        ...prev[entityType],
        status,
        ...(count !== undefined && { count }),
      },
    }));
  };

  /**
   * Обновляет время последней синхронизации
   */
  const updateLastSyncTime = () => {
    setLastSync(new Date().toLocaleString());
  };

  /**
   * Обработка ошибки синхронизации
   */
  const handleSyncError = (errorMessage: string) => {
    setSyncStatus({
      users: { status: "error", count: 0 },
      projects: { status: "error", count: 0 },
    });
    
    toast.error(errorMessage);
  };

  /**
   * Имитация синхронизации данных с облачным хранилищем
   */
  const syncLocalToCloud = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setAllEntitiesStatus("syncing");

      toast.info("Имитация синхронизации данных с облачным хранилищем...");

      // Получаем данные из localStorage
      const usersCount = getEntityCount("users");
      const projectsCount = getEntityCount("projects");

      // Создаем резервные копии
      await simulateNetworkDelay();
      backupEntityData("users");
      backupEntityData("projects");

      // Обновляем статус
      updateEntityStatus("users", "success", usersCount);
      updateEntityStatus("projects", "success", projectsCount);
      
      // Обновляем время последней синхронизации
      updateLastSyncTime();

      toast.success(
        `Синхронизация завершена. Синхронизировано: ${usersCount} пользователей, ${projectsCount} проектов`
      );
    } catch (error) {
      handleSyncError("Не удалось синхронизировать данные");
    }
  };

  /**
   * Имитация загрузки данных из облачного хранилища
   */
  const syncCloudToLocal = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setAllEntitiesStatus("syncing");

      toast.info("Имитация загрузки данных из облачного хранилища...");

      // Имитируем задержку сети
      await simulateNetworkDelay();

      // Проверяем наличие резервных копий
      const hasBackups = checkBackupsExistence();

      if (hasBackups) {
        // Восстанавливаем данные из резервных копий
        const usersCount = restoreEntityFromBackup("users");
        const projectsCount = restoreEntityFromBackup("projects");

        // Обновляем статус
        updateEntityStatus("users", "success", usersCount);
        updateEntityStatus("projects", "success", projectsCount);

        // Обновляем время последней синхронизации
        updateLastSyncTime();

        toast.success(
          `Данные загружены из облачного хранилища: ${usersCount} пользователей, ${projectsCount} проектов`
        );
      } else {
        // Если нет резервных копий, сообщаем об этом
        toast.error("Нет данных для восстановления из облачного хранилища");

        // Обновляем статус
        setAllEntitiesStatus("error");
      }
    } catch (error) {
      handleSyncError("Не удалось загрузить данные из облачного хранилища");
    }
  };

  /**
   * Устанавливает статус для всех сущностей
   */
  const setAllEntitiesStatus = (status: SyncState["status"]) => {
    setSyncStatus({
      users: { status, count: syncStatus.users.count },
      projects: { status, count: syncStatus.projects.count },
    });
  };

  /**
   * Имитирует задержку сети
   */
  const simulateNetworkDelay = () => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  /**
   * Создает резервную копию данных указанной сущности
   */
  const backupEntityData = (entityType: string) => {
    const dataStr = localStorage.getItem(entityType) || "[]";
    localStorage.setItem(`cloud_${entityType}_backup`, dataStr);
  };

  /**
   * Проверяет существование резервных копий
   */
  const checkBackupsExistence = (): boolean => {
    return Boolean(
      localStorage.getItem("cloud_users_backup") &&
      localStorage.getItem("cloud_projects_backup")
    );
  };

  /**
   * Восстанавливает данные сущности из резервной копии
   */
  const restoreEntityFromBackup = (entityType: string): number => {
    const backupData = localStorage.getItem(`cloud_${entityType}_backup`) || "[]";
    localStorage.setItem(entityType, backupData);
    
    const data = JSON.parse(backupData);
    return Array.isArray(data) ? data.length : 0;
  };

  /**
   * Определяет общее состояние синхронизации
   */
  const getOverallSyncStatus = (): string => {
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

  /**
   * Определяет, находится ли процесс в состоянии синхронизации
   */
  const isSyncing = () => {
    return syncStatus.users.status === "syncing" || syncStatus.projects.status === "syncing";
  };

  // Получаем общий статус синхронизации
  const overallStatus = getOverallSyncStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Синхронизация данных</span>
          <StatusBadge status={overallStatus as any} />
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
