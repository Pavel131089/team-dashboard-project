
import { useState, useCallback } from "react";
import { SyncState, EntitySyncState, SyncStatus } from "./useDataSync";

/**
 * Хук для управления состоянием синхронизации
 */
export function useSyncStatus() {
  // Начальное состояние
  const [syncState, setSyncState] = useState<SyncState>({
    users: { count: 0, status: "idle" },
    projects: { count: 0, status: "idle" }
  });

  /**
   * Обновляет состояние синхронизации для конкретной сущности
   */
  const setSyncStatus = useCallback((entity: keyof SyncState, status: SyncStatus) => {
    setSyncState(prev => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        status
      }
    }));
  }, []);

  /**
   * Обновляет количество сущностей
   */
  const setEntityCount = useCallback((entity: keyof SyncState, count: number) => {
    setSyncState(prev => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        count
      }
    }));
  }, []);

  /**
   * Получает общий статус синхронизации на основе статусов всех сущностей
   */
  const getOverallStatus = useCallback((): SyncStatus => {
    const statuses = Object.values(syncState).map(entity => entity.status);
    
    if (statuses.includes("error")) {
      return "error";
    }
    
    if (statuses.includes("syncing")) {
      return "syncing";
    }
    
    if (statuses.every(status => status === "success")) {
      return "success";
    }
    
    return "idle";
  }, [syncState]);

  return {
    syncState,
    setSyncStatus,
    setEntityCount,
    getOverallStatus
  };
}
