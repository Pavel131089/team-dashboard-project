
import React, { useState, useEffect } from "react";
import { User } from "@/types/index";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icon";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface UserShareButtonProps {
  users: User[];
  disabled?: boolean;
}

/**
 * Компонент для обмена пользователями через URL-ссылку
 */
const UserShareButton: React.FC<UserShareButtonProps> = ({ 
  users, 
  disabled = false 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportLink, setExportLink] = useState<string>("");
  const [includePasswords, setIncludePasswords] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Генерируем ссылку при открытии диалога
  useEffect(() => {
    if (isDialogOpen) {
      generateExportLink();
    }
  }, [isDialogOpen, includePasswords]);

  /**
   * Генерирует ссылку для экспорта пользователей
   */
  const generateExportLink = () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (!users || users.length === 0) {
        setError("Нет пользователей для экспорта");
        setExportLink("");
        setIsGenerating(false);
        return;
      }
      
      // Безопасное клонирование массива пользователей
      const usersToExport = users.map(user => {
        // Если не включаем пароли, создаем копию без пароля
        if (!includePasswords) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        // Возвращаем безопасную копию объекта
        return {...user};
      });

      // Создаем URL с закодированными данными
      const serializedData = JSON.stringify(usersToExport);
      const encodedUsers = btoa(encodeURIComponent(serializedData));
      const baseUrl = window.location.origin;
      const generatedLink = `${baseUrl}?users=${encodedUsers}`;
      
      setExportLink(generatedLink);
      setIsGenerating(false);
    } catch (error) {
      console.error("Ошибка при создании ссылки:", error);
      setError("Не удалось создать ссылку для экспорта");
      setExportLink("");
      setIsGenerating(false);
    }
  };

  /**
   * Обработчик копирования ссылки в буфер обмена
   */
  const handleCopyLink = () => {
    if (!exportLink) {
      setError("Нет ссылки для копирования");
      return;
    }
    
    try {
      navigator.clipboard.writeText(exportLink)
        .then(() => {
          toast({
            title: "Успешно",
            description: "Ссылка скопирована в буфер обмена",
          });
        })
        .catch(err => {
          console.error("Ошибка при копировании ссылки:", err);
          setError("Не удалось скопировать ссылку автоматически. Скопируйте вручную.");
          
          // Выделяем текст для ручного копирования
          const input = document.getElementById("export-link-input") as HTMLInputElement;
          if (input) {
            input.select();
          }
        });
    } catch (err) {
      console.error("Ошибка при копировании:", err);
      setError("Не удалось скопировать ссылку. Скопируйте вручную.");
      
      // Выделяем текст для ручного копирования
      const input = document.getElementById("export-link-input") as HTMLInputElement;
      if (input) {
        input.select();
      }
    }
  };

  /**
   * Обработчик переключения включения паролей
   */
  const toggleIncludePasswords = () => {
    setIncludePasswords(!includePasswords);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
      >
        <Icon name="Share2" className="mr-2 h-4 w-4" />
        Экспорт пользователей
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Экспорт пользователей</DialogTitle>
            <DialogDescription>
              Скопируйте эту ссылку и откройте её на другом устройстве, чтобы импортировать пользователей.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-passwords"
                checked={includePasswords}
                onChange={toggleIncludePasswords}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="include-passwords" className="text-sm">
                Включить пароли пользователей
              </label>
            </div>
            
            <div className="flex flex-col items-stretch space-y-2">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {isGenerating ? (
                <div className="h-10 flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-2">Генерация ссылки...</span>
                </div>
              ) : (
                <>
                  <Input
                    id="export-link-input"
                    value={exportLink}
                    readOnly
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="font-mono text-xs"
                  />
                  <Button 
                    onClick={handleCopyLink} 
                    type="button" 
                    className="w-full"
                    disabled={!exportLink}
                  >
                    <Icon name="Copy" className="mr-2 h-4 w-4" />
                    Копировать ссылку
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserShareButton;
