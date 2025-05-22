
import { useState, useCallback } from "react";

// Типы для состояния синхронизации
export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface EntitySyncState {
  count: number;
  status: SyncStatus;
}

export interface SyncState {
  projects: EntitySyncState;
  users: EntitySyncState;
}

/**
 * Хук для управления синхронизацией данных
 */
export function useDataSync(
  setSyncStatus: (entity: keyof SyncState, status: SyncStatus) => void
) {
  // Последняя синхронизация
  const [lastSync, setLastSync] = useState<string | null>(null);

  /**
   * Проверяет количество записей в хранилище
   */
  const checkDataCount = useCallback(() => {
    try {
      // Получаем данные из локального хранилища
      const usersStr = localStorage.getItem("users") || "[]";
      const projectsStr = localStorage.getItem("projects") || "[]";
      
      // Парсим данные
      const users = JSON.parse(usersStr);
      const projects = JSON.parse(projectsStr);
      
      // Возвращаем количество записей
      return {
        users: Array.isArray(users) ? users.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0
      };
    } catch (error) {
      console.error("Ошибка при проверке количества данных:", error);
      return { users: 0, projects: 0 };
    }
  }, []);

  /**
   * Синхронизация данных из локального хранилища в облако (имитация)
   */
  const syncLocalToCloud = useCallback(async () => {
    // Устанавливаем статус "синхронизация" для всех сущностей
    setSyncStatus("users", "syncing");
    setSyncStatus("projects", "syncing");
    
    // Имитация синхронизации
    setTimeout(() => {
      try {
        // Имитация успешной синхронизации пользователей
        setSyncStatus("users", "success");
        
        // Имитация успешной синхронизации проектов через 1 секунду
        setTimeout(() => {
          setSyncStatus("projects", "success");
          
          // Обновляем время последней синхронизации
          const now = new Date().toLocaleString();
          setLastSync(now);
        }, 1000);
      } catch (error) {
        console.error("Ошибка при синхронизации:", error);
        setSyncStatus("users", "error");
        setSyncStatus("projects", "error");
      }
    }, 2000);
  }, [setSyncStatus]);

  /**
   * Синхронизация данных из облака в локальное хранилище (имитация)
   */
  const syncCloudToLocal = useCallback(async () => {
    // Устанавливаем статус "синхронизация" для всех сущностей
    setSyncStatus("users", "syncing");
    setSyncStatus("projects", "syncing");
    
    // Имитация синхронизации
    setTimeout(() => {
      try {
        // Имитация успешной синхронизации пользователей
        setSyncStatus("users", "success");
        
        // Имитация успешной синхронизации проектов через 1 секунду
        setTimeout(() => {
          setSyncStatus("projects", "success");
          
          // Обновляем время последней синхронизации
          const now = new Date().toLocaleString();
          setLastSync(now);
        }, 1000);
      } catch (error) {
        console.error("Ошибка при синхронизации:", error);
        setSyncStatus("users", "error");
        setSyncStatus("projects", "error");
      }
    }, 2000);
  }, [setSyncStatus]);

  return {
    checkDataCount,
    syncLocalToCloud,
    syncCloudToLocal,
    lastSync,
    setLastSync
  };
}
