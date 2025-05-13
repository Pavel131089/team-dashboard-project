
import React, { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface UserShareButtonProps {
  users: User[];
  disabled?: boolean;
}

/**
 * Кнопка для обмена пользователями через URL-ссылку
 */
const UserShareButton: React.FC<UserShareButtonProps> = ({ users, disabled = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportLink, setExportLink] = useState<string>("");
  const [includePasswords, setIncludePasswords] = useState(true);

  /**
   * Генерирует ссылку для экспорта пользователей
   */
  const generateExportLink = () => {
    try {
      if (!users || users.length === 0) {
        toast({
          title: "Ошибка",
          description: "Нет пользователей для экспорта",
          variant: "destructive",
        });
        return "";
      }
      
      // Подготавливаем пользователей для экспорта
      const usersToExport = [...users].map(user => {
        // Если не включаем пароли, создаем копию без пароля
        if (!includePasswords) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        return user;
      });
      
      const encodedUsers = encodeURIComponent(btoa(JSON.stringify(usersToExport)));
      const baseUrl = window.location.origin;
      return `${baseUrl}?users=${encodedUsers}`;
    } catch (error) {
      console.error("Ошибка при создании ссылки:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать ссылку для экспорта",
        variant: "destructive",
      });
      return "";
    }
  };

  /**
   * Обработчик копирования ссылки в буфер обмена
   */
  const handleCopyLink = () => {
    if (!exportLink) {
      const link = generateExportLink();
      if (!link) return;
      setExportLink(link);
    }
    
    navigator.clipboard
      .writeText(exportLink || generateExportLink())
      .then(() => {
        toast({
          title: "Успешно",
          description: "Ссылка скопирована в буфер обмена",
        });
        setIsDialogOpen(false);
      })
      .catch((err) => {
        console.error("Ошибка при копировании ссылки:", err);
        
        // Показываем сообщение об ошибке
        toast({
          title: "Ошибка копирования",
          description: "Используйте ручное копирование: выделите ссылку и скопируйте",
        });
        
        // На мобильных устройствах может не работать clipboard API
        const input = document.getElementById("export-link-input") as HTMLInputElement;
        if (input) {
          input.select();
        }
      });
  };

  /**
   * Обработчик открытия диалога
   */
  const handleOpenDialog = () => {
    const link = generateExportLink();
    setExportLink(link);
    setIsDialogOpen(true);
  };

  /**
   * Обработчик переключения включения паролей
   */
  const toggleIncludePasswords = () => {
    setIncludePasswords(!includePasswords);
    // При изменении этого параметра обновляем ссылку
    setExportLink("");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={handleOpenDialog}
          disabled={disabled}
        >
          <Icon name="Share2" className="mr-2 h-4 w-4" />
          Экспорт пользователей
        </Button>
      </DialogTrigger>
      
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
            <Input
              id="export-link-input"
              value={exportLink}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="font-mono text-xs"
            />
            <Button onClick={handleCopyLink} type="button" className="w-full">
              <Icon name="Copy" className="mr-2 h-4 w-4" />
              Копировать ссылку
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserShareButton;
