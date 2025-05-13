
import { useState } from "react";
import { toast } from "sonner";
import { SyncStatusType } from "../sync/SyncStatusBadge";

// Тип для функции обновления статуса синхронизации
type SetSyncStatusFn = (
  entityType: "users" | "projects", 
  status: SyncStatusType, 
  count?: number
) => void;

/**
 * Хук для управления синхронизацией данных
 */
export const useDataSync = (setSyncStatus: SetSyncStatusFn) => {
  // Время последней синхронизации
  const [lastSync, setLastSync] = useState<string | null>(null);

  /**
   * Обновляет время последней синхронизации
   */
  const updateLastSyncTime = () => {
    setLastSync(new Date().toLocaleString());
  };

  /**
   * Имитирует задержку сети
   */
  const simulateNetworkDelay = () => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  /**
   * Получение количества записей в локальном хранилище
   */
  const checkDataCount = async () => {
    try {
      // Получаем пользователей
      setSyncStatus("users", "syncing");
      const usersCount = getEntityCount("users");
      setSyncStatus("users", "success", usersCount);

      // Получаем проекты
      setSyncStatus("projects", "syncing");
      const projectsCount = getEntityCount("projects");
      setSyncStatus("projects", "success", projectsCount);

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
  const getEntityCount = (entityType: string): number => {
    const dataStr = localStorage.getItem(entityType) || "[]";
    const data = JSON.parse(dataStr);
    return Array.isArray(data) ? data.length : 0;
  };

  /**
   * Обработка ошибки синхронизации
   */
  const handleSyncError = (errorMessage: string) => {
    setSyncStatus("users", "error", 0);
    setSyncStatus("projects", "error", 0);
    
    toast.error(errorMessage);
  };

  /**
   * Имитация синхронизации данных с облачным хранилищем
   */
  const syncLocalToCloud = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setSyncStatus("users", "syncing");
      setSyncStatus("projects", "syncing");

      toast.info("Имитация синхронизации данных с облачным хранилищем...");

      // Получаем данные из localStorage
      const usersCount = getEntityCount("users");
      const projectsCount = getEntityCount("projects");

      // Создаем резервные копии
      await simulateNetworkDelay();
      backupEntityData("users");
      backupEntityData("projects");

      // Обновляем статус
      setSyncStatus("users", "success", usersCount);
      setSyncStatus("projects", "success", projectsCount);
      
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
      setSyncStatus("users", "syncing");
      setSyncStatus("projects", "syncing");

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
        setSyncStatus("users", "success", usersCount);
        setSyncStatus("projects", "success", projectsCount);

        // Обновляем время последней синхронизации
        updateLastSyncTime();

        toast.success(
          `Данные загружены из облачного хранилища: ${usersCount} пользователей, ${projectsCount} проектов`
        );
      } else {
        // Если нет резервных копий, сообщаем об этом
        toast.error("Нет данных для восстановления из облачного хранилища");

        // Обновляем статус
        setSyncStatus("users", "error", 0);
        setSyncStatus("projects", "error", 0);
      }
    } catch (error) {
      handleSyncError("Не удалось загрузить данные из облачного хранилища");
    }
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

  return {
    checkDataCount,
    syncLocalToCloud,
    syncCloudToLocal,
    lastSync,
    setLastSync
  };
};
