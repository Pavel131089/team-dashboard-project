
import React, { useState, useEffect } from "react";
import { User } from "@/types/index";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Dialog } from "@/components/ui/dialog";
import { useShareLinkGenerator, copyLinkToClipboard } from "./share/ShareLinkGenerator";
import ShareDialogContent from "./share/ShareDialogContent";

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
  // Состояние для диалога и функций генерации ссылки
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportLink, setExportLink] = useState<string>("");
  const [includePasswords, setIncludePasswords] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Используем хук для генерации ссылки
  const { generateExportLink, isGenerating } = useShareLinkGenerator(users);

  // Генерируем ссылку при открытии диалога или изменении настроек
  useEffect(() => {
    if (isDialogOpen) {
      handleGenerateLink();
    }
  }, [isDialogOpen, includePasswords]);

  /**
   * Генерирует ссылку для экспорта пользователей
   */
  const handleGenerateLink = async () => {
    setError(null);
    const result = await generateExportLink(includePasswords);
    
    if (result.error) {
      setError(result.error);
      setExportLink("");
    } else {
      setExportLink(result.link);
    }
  };

  /**
   * Обработчик копирования ссылки в буфер обмена
   */
  const handleCopyLink = () => {
    copyLinkToClipboard(exportLink, "export-link-input");
  };

  /**
   * Обработчик переключения включения паролей
   */
  const handleTogglePasswords = (include: boolean) => {
    setIncludePasswords(include);
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
        <ShareDialogContent
          error={error}
          exportLink={exportLink}
          isGenerating={isGenerating}
          includePasswords={includePasswords}
          onIncludePasswordsChange={handleTogglePasswords}
          onCopyLink={handleCopyLink}
          onClose={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default UserShareButton;
