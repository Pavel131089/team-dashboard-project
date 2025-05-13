import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";

/**
 * Компонент для отображения статуса хранилища
 */
const CloudStorageStatus = () => {
  const [syncStatus, setSyncStatus] = useState({
    users: { status: "idle", count: 0 },
    projects: { status: "idle", count: 0 },
  });

  const [lastSync, setLastSync] = useState(null);

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
      setSyncStatus((prev) => ({
        ...prev,
        users: { ...prev.users, status: "syncing" },
      }));

      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);

      setSyncStatus((prev) => ({
        ...prev,
        users: { status: "success", count: users.length },
      }));

      // Получаем проекты
      setSyncStatus((prev) => ({
        ...prev,
        projects: { ...prev.projects, status: "syncing" },
      }));

      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);

      setSyncStatus((prev) => ({
        ...prev,
        projects: { status: "success", count: projects.length },
      }));

      // Обновляем время последней синхронизации
      setLastSync(new Date().toLocaleString());

      toast.success("Данные успешно получены из локального хранилища");
    } catch (error) {
      console.error("Ошибка при получении данных:", error);

      setSyncStatus({
        users: { status: "error", count: 0 },
        projects: { status: "error", count: 0 },
      });

      toast.error("Не удалось получить данные из хранилища");
    }
  };

  /**
   * Имитация синхронизации облачных данных
   */
  const syncLocalToCloud = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setSyncStatus({
        users: { status: "syncing", count: 0 },
        projects: { status: "syncing", count: 0 },
      });

      toast.info("Имитация синхронизации данных с облачным хранилищем...");

      // Получаем пользователей и проекты из localStorage
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);

      const projectsStr = localStorage.getItem("projects") || "[]";
      const projects = JSON.parse(projectsStr);

      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Обновляем статус
      setSyncStatus({
        users: { status: "success", count: users.length },
        projects: { status: "success", count: projects.length },
      });

      // Создаем резервную копию данных (имитация облачной синхронизации)
      localStorage.setItem("cloud_users_backup", usersStr);
      localStorage.setItem("cloud_projects_backup", projectsStr);

      // Обновляем время последней синхронизации
      setLastSync(new Date().toLocaleString());

      toast.success(
        `Синхронизация завершена. Синхронизировано: ${users.length} пользователей, ${projects.length} проектов`,
      );
    } catch (error) {
      console.error("Ошибка при синхронизации:", error);

      setSyncStatus({
        users: { status: "error", count: 0 },
        projects: { status: "error", count: 0 },
      });

      toast.error("Не удалось синхронизировать данные");
    }
  };

  /**
   * Имитация загрузки данных из облачного хранилища
   */
  const syncCloudToLocal = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setSyncStatus({
        users: { status: "syncing", count: 0 },
        projects: { status: "syncing", count: 0 },
      });

      toast.info("Имитация загрузки данных из облачного хранилища...");

      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Проверяем наличие резервных копий
      const usersBackup = localStorage.getItem("cloud_users_backup");
      const projectsBackup = localStorage.getItem("cloud_projects_backup");

      if (usersBackup && projectsBackup) {
        // Восстанавливаем данные из резервных копий
        localStorage.setItem("users", usersBackup);
        localStorage.setItem("projects", projectsBackup);

        const users = JSON.parse(usersBackup);
        const projects = JSON.parse(projectsBackup);

        // Обновляем статус
        setSyncStatus({
          users: { status: "success", count: users.length },
          projects: { status: "success", count: projects.length },
        });

        // Обновляем время последней синхронизации
        setLastSync(new Date().toLocaleString());

        toast.success(
          `Данные загружены из облачного хранилища: ${users.length} пользователей, ${projects.length} проектов`,
        );
      } else {
        // Если нет резервных копий, сообщаем об этом
        toast.error("Нет данных для восстановления из облачного хранилища");

        // Обновляем статус
        setSyncStatus({
          users: { status: "error", count: 0 },
          projects: { status: "error", count: 0 },
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);

      setSyncStatus({
        users: { status: "error", count: 0 },
        projects: { status: "error", count: 0 },
      });

      toast.error("Не удалось загрузить данные из облачного хранилища");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "idle":
        return <Icon name="CircleDashed" className="text-slate-400" />;
      case "syncing":
        return <Icon name="RefreshCw" className="animate-spin text-blue-500" />;
      case "success":
        return <Icon name="CheckCircle" className="text-green-500" />;
      case "error":
        return <Icon name="XCircle" className="text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Синхронизация данных</span>
          <Badge
            variant="outline"
            className={
              syncStatus.users.status === "error" ||
              syncStatus.projects.status === "error"
                ? "bg-red-100 text-red-800"
                : syncStatus.users.status === "syncing" ||
                    syncStatus.projects.status === "syncing"
                  ? "bg-blue-100 text-blue-800"
                  : syncStatus.users.status === "success" ||
                      syncStatus.projects.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100"
            }
          >
            {syncStatus.users.status === "error" ||
            syncStatus.projects.status === "error"
              ? "Ошибка синхронизации"
              : syncStatus.users.status === "syncing" ||
                  syncStatus.projects.status === "syncing"
                ? "Синхронизация..."
                : syncStatus.users.status === "success" ||
                    syncStatus.projects.status === "success"
                  ? "Синхронизировано"
                  : "Не синхронизировано"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-md bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Пользователи</span>
              {getStatusIcon(syncStatus.users.status)}
            </div>
            <div className="text-2xl font-semibold">
              {syncStatus.users.count}
            </div>
            <div className="text-xs text-slate-500">записей в хранилище</div>
          </div>

          <div className="p-3 border rounded-md bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Проекты</span>
              {getStatusIcon(syncStatus.projects.status)}
            </div>
            <div className="text-2xl font-semibold">
              {syncStatus.projects.count}
            </div>
            <div className="text-xs text-slate-500">записей в хранилище</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={
              syncStatus.users.status === "syncing" ||
              syncStatus.projects.status === "syncing"
            }
            onClick={checkDataCount}
          >
            <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
            Обновить статистику
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={
                syncStatus.users.status === "syncing" ||
                syncStatus.projects.status === "syncing"
              }
              onClick={syncLocalToCloud}
            >
              <Icon name="Upload" className="mr-2 h-4 w-4" />
              Загрузить в облако
            </Button>

            <Button
              disabled={
                syncStatus.users.status === "syncing" ||
                syncStatus.projects.status === "syncing"
              }
              onClick={syncCloudToLocal}
            >
              <Icon name="Download" className="mr-2 h-4 w-4" />
              Загрузить из облака
            </Button>
          </div>
        </div>

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
