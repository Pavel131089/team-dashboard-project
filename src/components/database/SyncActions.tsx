
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface SyncActionsProps {
  isSyncing: boolean;
  onRefreshStats: () => void;
  onUploadToCloud: () => void;
  onDownloadFromCloud: () => void;
}

/**
 * Компонент с кнопками действий для синхронизации
 */
const SyncActions: React.FC<SyncActionsProps> = ({
  isSyncing,
  onRefreshStats,
  onUploadToCloud,
  onDownloadFromCloud,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="w-full"
        disabled={isSyncing}
        onClick={onRefreshStats}
      >
        <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
        Обновить статистику
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button disabled={isSyncing} onClick={onUploadToCloud}>
          <Icon name="Upload" className="mr-2 h-4 w-4" />
          Загрузить в облако
        </Button>

        <Button disabled={isSyncing} onClick={onDownloadFromCloud}>
          <Icon name="Download" className="mr-2 h-4 w-4" />
          Загрузить из облака
        </Button>
      </div>
    </div>
  );
};

export default SyncActions;
