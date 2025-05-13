
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SyncStatusBadge from "./sync/SyncStatusBadge";
import EntityCounter from "./sync/EntityCounter";
import SyncActionButtons from "./sync/SyncActionButtons";
import { useSyncStatus } from "./hooks/useSyncStatus";
import { useDataSync } from "./hooks/useDataSync";

/**
 * Компонент для отображения статуса хранилища данных
 * и управления синхронизацией
 */
const CloudStorageStatus: React.FC = () => {
  // Используем кастомные хуки для управления состоянием и синхронизацией
  const { syncState, setSyncStatus, getOverallStatus } = useSyncStatus();
  const { 
    checkDataCount,
    syncLocalToCloud, 
    syncCloudToLocal,
    lastSync, 
    setLastSync
  } = useDataSync(setSyncStatus);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    checkDataCount();
  }, []);

  // Получаем общий статус синхронизации
  const overallStatus = getOverallStatus();
  
  // Определяем, находится ли процесс в состоянии синхронизации
  const isSyncInProgress = syncState.users.status === "syncing" || syncState.projects.status === "syncing";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Синхронизация данных</span>
          <SyncStatusBadge status={overallStatus} />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Счетчики сущностей */}
        <div className="grid grid-cols-2 gap-4">
          <EntityCounter
            title="Пользователи"
            count={syncState.users.count}
            status={syncState.users.status}
          />

          <EntityCounter
            title="Проекты"
            count={syncState.projects.count}
            status={syncState.projects.status}
          />
        </div>

        {/* Кнопки действий */}
        <SyncActionButtons
          isSyncing={isSyncInProgress}
          onRefreshStats={checkDataCount}
          onUploadToCloud={syncLocalToCloud}
          onDownloadFromCloud={syncCloudToLocal}
        />

        {/* Информация о последней синхронизации */}
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
