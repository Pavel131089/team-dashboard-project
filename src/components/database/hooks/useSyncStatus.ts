
import { useState } from "react";
import { SyncStatusType } from "../sync/SyncStatusBadge";

/**
 * Тип для состояния синхронизации сущности
 */
interface SyncState {
  status: SyncStatusType;
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
 * Хук для управления состоянием синхронизации
 */
export const useSyncStatus = () => {
  // Состояние синхронизации для разных типов данных
  const [syncState, setSyncState] = useState<SyncStatus>({
    users: { status: "idle", count: 0 },
    projects: { status: "idle", count: 0 },
  });

  /**
   * Обновляет статус синхронизации для сущности
   */
  const setSyncStatus = (
    entityType: keyof SyncStatus,
    status: SyncStatusType,
    count?: number
  ) => {
    setSyncState((prev) => ({
      ...prev,
      [entityType]: { 
        ...prev[entityType],
        status,
        ...(count !== undefined && { count }),
      },
    }));
  };

  /**
   * Устанавливает статус для всех сущностей
   */
  const setAllEntitiesStatus = (status: SyncStatusType) => {
    setSyncState({
      users: { status, count: syncState.users.count },
      projects: { status, count: syncState.projects.count },
    });
  };

  /**
   * Определяет общее состояние синхронизации
   */
  const getOverallStatus = (): SyncStatusType => {
    if (syncState.users.status === "error" || syncState.projects.status === "error") {
      return "error";
    }
    if (syncState.users.status === "syncing" || syncState.projects.status === "syncing") {
      return "syncing";
    }
    if (syncState.users.status === "success" || syncState.projects.status === "success") {
      return "success";
    }
    return "idle";
  };

  return {
    syncState,
    setSyncStatus,
    setAllEntitiesStatus,
    getOverallStatus
  };
};
