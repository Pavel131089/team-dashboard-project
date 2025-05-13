
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import { firebaseUserService } from "@/services/firebase/userService";
import { firebaseProjectService } from "@/services/firebase/projectService";

/**
 * Компонент для отображения статуса облачного хранилища и синхронизации данных
 */
const CloudStorageStatus: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<{
    users: { status: 'idle' | 'syncing' | 'success' | 'error'; count: number };
    projects: { status: 'idle' | 'syncing' | 'success' | 'error'; count: number };
  }>({
    users: { status: 'idle', count: 0 },
    projects: { status: 'idle', count: 0 }
  });
  
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Проверяем количество записей при загрузке компонента
  useEffect(() => {
    checkDataCount();
  }, []);

  /**
   * Получение количества записей в базе данных
   */
  const checkDataCount = async () => {
    try {
      // Получаем пользователей
      setSyncStatus(prev => ({
        ...prev,
        users: { ...prev.users, status: 'syncing' }
      }));
      
      const users = await firebaseUserService.getAllUsers();
      
      setSyncStatus(prev => ({
        ...prev,
        users: { status: 'success', count: users.length }
      }));
      
      // Получаем проекты
      setSyncStatus(prev => ({
        ...prev,
        projects: { ...prev.projects, status: 'syncing' }
      }));
      
      const projects = await firebaseProjectService.getAllProjects();
      
      setSyncStatus(prev => ({
        ...prev,
        projects: { status: 'success', count: projects.length }
      }));
      
      // Обновляем время последней синхронизации
      setLastSync(new Date().toLocaleString());
      
      toast.success("Данные успешно получены из облачного хранилища");
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      
      setSyncStatus({
        users: { status: 'error', count: 0 },
        projects: { status: 'error', count: 0 }
      });
      
      toast.error("Не удалось получить данные из облачного хранилища");
    }
  };

  /**
   * Синхронизация локальных данных с облачным хранилищем
   */
  const syncLocalToCloud = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setSyncStatus({
        users: { status: 'syncing', count: 0 },
        projects: { status: 'syncing', count: 0 }
      });
      
      // Имитация процесса синхронизации (в реальном проекте здесь будет 
      // реальная синхронизация данных из localStorage в Firebase)
      toast.info("Начинаем синхронизацию данных с облачным хранилищем...");
      
      // Получаем пользователей из localStorage
      const usersJson = localStorage.getItem("users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      let syncedUsersCount = 0;
      
      // Синхронизируем каждого пользователя
      for (const user of users) {
        if (!user.id) continue;
        
        // Проверяем существование пользователя в Firebase
        const existingUser = await firebaseUserService.getUserById(user.id);
        
        if (!existingUser) {
          // Создаем нового пользователя
          await firebaseUserService.createUser(user);
          syncedUsersCount++;
        }
      }
      
      // Обновляем статус пользователей
      setSyncStatus(prev => ({
        ...prev,
        users: { status: 'success', count: syncedUsersCount }
      }));
      
      // Получаем проекты из localStorage
      const projectsJson = localStorage.getItem("projects");
      const projects = projectsJson ? JSON.parse(projectsJson) : [];
      
      let syncedProjectsCount = 0;
      
      // Синхронизируем каждый проект
      for (const project of projects) {
        if (!project.id) continue;
        
        // Проверяем существование проекта в Firebase
        const existingProject = await firebaseProjectService.getProjectById(project.id);
        
        if (!existingProject) {
          // Создаем новый проект
          await firebaseProjectService.createProject(project);
          syncedProjectsCount++;
        }
      }
      
      // Обновляем статус проектов
      setSyncStatus(prev => ({
        ...prev,
        projects: { status: 'success', count: syncedProjectsCount }
      }));
      
      // Обновляем время последней синхронизации
      setLastSync(new Date().toLocaleString());
      
      toast.success(`Синхронизация завершена. Синхронизировано: ${syncedUsersCount} пользователей, ${syncedProjectsCount} проектов`);
    } catch (error) {
      console.error("Ошибка при синхронизации:", error);
      
      setSyncStatus({
        users: { status: 'error', count: 0 },
        projects: { status: 'error', count: 0 }
      });
      
      toast.error("Не удалось синхронизировать данные с облачным хранилищем");
    }
  };

  /**
   * Синхронизация данных из облачного хранилища в локальное
   */
  const syncCloudToLocal = async () => {
    try {
      // Устанавливаем статус "синхронизация"
      setSyncStatus({
        users: { status: 'syncing', count: 0 },
        projects: { status: 'syncing', count: 0 }
      });
      
      toast.info("Загрузка данных из облачного хранилища...");
      
      // Получаем пользователей из Firebase
      const users = await firebaseUserService.getAllUsers();
      
      // Сохраняем в localStorage
      localStorage.setItem("users", JSON.stringify(users));
      
      // Обновляем статус пользователей
      setSyncStatus(prev => ({
        ...prev,
        users: { status: 'success', count: users.length }
      }));
      
      // Получаем проекты из Firebase
      const projects = await firebaseProjectService.getAllProjects();
      
      // Сохраняем в localStorage
      localStorage.setItem("projects", JSON.stringify(projects));
      
      // Обновляем статус проектов
      setSyncStatus(prev => ({
        ...prev,
        projects: { status: 'success', count: projects.length }
      }));
      
      // Обновляем время последней синхронизации
      setLastSync(new Date().toLocaleString());
      
      toast.success(`Данные загружены из облачного хранилища: ${users.length} пользователей, ${projects.length} проектов`);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      
      setSyncStatus({
        users: { status: 'error', count: 0 },
        projects: { status: 'error', count: 0 }
      });
      
      toast.error("Не удалось загрузить данные из облачного хранилища");
    }
  };

  const getStatusIcon = (status: 'idle' | 'syncing' | 'success' | 'error') => {
    switch (status) {
      case 'idle':
        return <Icon name="CircleDashed" className="text-slate-400" />;
      case 'syncing':
        return <Icon name="RefreshCw" className="animate-spin text-blue-500" />;
      case 'success':
        return <Icon name="CheckCircle" className="text-green-500" />;
      case 'error':
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
              syncStatus.users.status === 'error' || syncStatus.projects.status === 'error'
                ? "bg-red-100 text-red-800"
                : syncStatus.users.status === 'syncing' || syncStatus.projects.status === 'syncing'
                ? "bg-blue-100 text-blue-800"
                : syncStatus.users.status === 'success' || syncStatus.projects.status === 'success'
                ? "bg-green-100 text-green-800"
                : "bg-slate-100"
            }
          >
            {syncStatus.users.status === 'error' || syncStatus.projects.status === 'error'
              ? "Ошибка синхронизации"
              : syncStatus.users.status === 'syncing' || syncStatus.projects.status === 'syncing'
              ? "Синхронизация..."
              : syncStatus.users.status === 'success' || syncStatus.projects.status === 'success'
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
            <div className="text-2xl font-semibold">{syncStatus.users.count}</div>
            <div className="text-xs text-slate-500">записей в базе данных</div>
          </div>
          
          <div className="p-3 border rounded-md bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">Проекты</span>
              {getStatusIcon(syncStatus.projects.status)}
            </div>
            <div className="text-2xl font-semibold">{syncStatus.projects.count}</div>
            <div className="text-xs text-slate-500">записей в базе данных</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={
              syncStatus.users.status === 'syncing' || 
              syncStatus.projects.status === 'syncing'
            }
            onClick={checkDataCount}
          >
            <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
            Обновить статистику
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={
                syncStatus.users.status === 'syncing' || 
                syncStatus.projects.status === 'syncing'
              }
              onClick={syncLocalToCloud}
            >
              <Icon name="Upload" className="mr-2 h-4 w-4" />
              Загрузить в облако
            </Button>
            
            <Button
              disabled={
                syncStatus.users.status === 'syncing' || 
                syncStatus.projects.status === 'syncing'
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
