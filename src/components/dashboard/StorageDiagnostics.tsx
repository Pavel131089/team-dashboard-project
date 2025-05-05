
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
          <CardTitle className="text-sm">Диагностика хранилища</CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsVisible(false)}>
            <Icon name="X" size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {storageStatus === "unavailable" && (
          <Alert variant="destructive" className="py-2">
            <AlertTitle>Проблема с хранилищем</AlertTitle>
            <AlertDescription>
              Локальное хранилище недоступно. Данные не будут сохраняться.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={testStorage}>
            <Icon name="Check" className="mr-1 h-3 w-3" />
            Проверить хранилище
          </Button>
          
          <Button size="sm" variant="outline" onClick={checkCurrentStorage}>
            <Icon name="Database" className="mr-1 h-3 w-3" />
            Проекты в хранилище
          </Button>
          
          <Button size="sm" variant="outline" onClick={addSampleProject}>
            <Icon name="PlusCircle" className="mr-1 h-3 w-3" />
            Добавить тестовый
          </Button>
          
          <Button size="sm" variant="outline" className="text-red-500" onClick={resetProjects}>
            <Icon name="Trash2" className="mr-1 h-3 w-3" />
            Удалить все
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageDiagnostics;
