
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import {
  testStorageAvailability,
  createSampleProject,
  resetProjectsStorage
} from "@/utils/storageUtils";

interface StorageDiagnosticsProps {
  onReloadProjects: () => void;
}

const StorageDiagnostics: React.FC<StorageDiagnosticsProps> = ({ onReloadProjects }) => {
  const [storageStatus, setStorageStatus] = useState<"unknown" | "available" | "unavailable">("unknown");
  const [isVisible, setIsVisible] = useState(false);

  const testStorage = () => {
    const isAvailable = testStorageAvailability();
    setStorageStatus(isAvailable ? "available" : "unavailable");
    
    toast[isAvailable ? "success" : "error"](
      isAvailable 
        ? "Хранилище доступно" 
        : "Хранилище недоступно. Возможны проблемы с сохранением данных."
    );
  };

  const addSampleProject = () => {
    const success = createSampleProject();
    
    if (success) {
      toast.success("Тестовый проект успешно добавлен");
      onReloadProjects();
    } else {
      toast.error("Не удалось добавить тестовый проект");
    }
  };

  const resetProjects = () => {
    if (window.confirm("Вы уверены, что хотите удалить все проекты? Это действие нельзя отменить.")) {
      const success = resetProjectsStorage();
      
      if (success) {
        toast.success("Все проекты успешно удалены");
        onReloadProjects();
      } else {
        toast.error("Не удалось удалить проекты");
      }
    }
  };

  const checkCurrentStorage = () => {
    try {
      const projectsStr = localStorage.getItem('projects');
      if (projectsStr) {
        const projects = JSON.parse(projectsStr);
        toast.success(`Текущее количество проектов: ${projects.length}`);
        console.log("Текущие проекты:", projects);
      } else {
        toast.info("Проекты не найдены в хранилище");
      }
    } catch (error) {
      toast.error("Ошибка при чтении проектов: " + (error as Error).message);
    }
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="fixed bottom-4 right-4 bg-white opacity-70 hover:opacity-100"
        onClick={() => setIsVisible(true)}
      >
        <Icon name="Tool" className="mr-2 h-4 w-4" />
        Диагностика
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-72 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="textВижу проблему с-sm">Диагностика загрузкой про хранилища</CardTitle>
          <Button variant="ghost" size="sm"ектов. Судя по ск className="h-6 w-риншоту, система не от6 p-0" onClick={()ображает ранее соз => setIsVisible(false)}>
            данные проекты при переходе на страницу Dashboard.

Про<Icon name="X" size={16} />
          блема может быть в не</Button>
        </div>
      </CardHeader>
      <CardContent className="spaceправильной работе с localStorage-y-2 text-xs">
        {. Давайте исправим это вstorageStatus === "unavailable" && (
          <Alert нескольких файлах:

 variant="destructive" className="py-2">
            <pp-write filepath="src/hooks/useDashboardData<AlertTitle>Проблема с хранилищем</AlertTitle.ts" partial>
import { useState>
            <AlertDescription>
              , useEffect } from "Локальное хранилище недоступноreact";
import { Project. Данные не будут с, User } from "@/охраняться.
            </AlertDescription>
          </Alert>
        )}types/project";
import { toast
        
        <div className="gri } from "sonner";
import {d grid-cols-2 gap-2"> NavigateFunction } from "react
          <Button size="sm" variant="-router-dom";

exportoutline" onClick={testStorage}> const useDashboardData
            <Icon name="Check = (navigate: NavigateFunction) => {" className="mr-1
  const [projects, setProjects] = useState<Project[]>([]);
   h-3 w-3"const [user, setUser] = />
            Проверить useState<User | null>(null);
   хранилище
          </Button>const [isLoading, setIs
          
          <Button size="sm" variant="outlineLoading] = useState(true);" onClick={checkCurrentStorage}>
            
  
  // Заг<Icon name="Database" className="mr-рузка данных п1 h-3 w-3" />
            Проользователя и проектов
  екты в хранилuseEffect(() => {
    loaище
          </Button>
          
          dUserAndProjects();
    <Button size="sm" variant="outline" onClick={addSampleProject}>
            // Добавим лог<Icon name="PlusCircle" classNameгирование для отлад="mr-1 h-3 wки
    console.log("us-3" />
            ДобавитьeDashboardData mount effect");
  }, [ тестовый
          </Button>
          
          <Button size="sm" variantnavigate]);

  // Функция заг="outline" className="textрузки пользователя и про-red-500" onClick={resetProjectsектов
  const loadUserAndProjects}>
            <Icon name="Trash2 = () => {
    set" className="mr-1 h-3IsLoading(true);
    // w-3" />
            Уд Загрузка пользалить все
          </Button>ователя из localStorage
    const user
        </div>
      </CardContent>FromStorage = localStorage.getItem
    </Card>
  );
};

export default StorageDiagnostics('user');
    if (userFromStorage);
