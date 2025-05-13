
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface ShareDialogContentProps {
  error: string | null;
  exportLink: string;
  isGenerating: boolean;
  includePasswords: boolean;
  onIncludePasswordsChange: (include: boolean) => void;
  onCopyLink: () => void;
  onClose: () => void;
}

/**
 * Содержимое диалога для экспорта пользователей
 */
const ShareDialogContent: React.FC<ShareDialogContentProps> = ({
  error,
  exportLink,
  isGenerating,
  includePasswords,
  onIncludePasswordsChange,
  onCopyLink,
  onClose
}) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Экспорт пользователей</DialogTitle>
        <DialogDescription>
          Скопируйте эту ссылку и откройте её на другом устройстве, чтобы импортировать пользователей.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <PasswordToggle 
          includePasswords={includePasswords}
          onChange={onIncludePasswordsChange}
        />
        
        <LinkSection 
          error={error}
          exportLink={exportLink}
          isGenerating={isGenerating}
          onCopyLink={onCopyLink}
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Закрыть
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

/**
 * Переключатель для включения/исключения паролей
 */
const PasswordToggle: React.FC<{
  includePasswords: boolean;
  onChange: (include: boolean) => void;
}> = ({ includePasswords, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="include-passwords"
        checked={includePasswords}
        onChange={() => onChange(!includePasswords)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <label htmlFor="include-passwords" className="text-sm">
        Включить пароли пользователей
      </label>
    </div>
  );
};

/**
 * Секция с ссылкой и кнопкой копирования
 */
const LinkSection: React.FC<{
  error: string | null;
  exportLink: string;
  isGenerating: boolean;
  onCopyLink: () => void;
}> = ({ error, exportLink, isGenerating, onCopyLink }) => {
  return (
    <div className="flex flex-col items-stretch space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {isGenerating ? (
        <LoadingIndicator />
      ) : (
        <LinkWithCopyButton 
          exportLink={exportLink} 
          onCopyLink={onCopyLink} 
        />
      )}
    </div>
  );
};

/**
 * Индикатор загрузки при генерации ссылки
 */
const LoadingIndicator: React.FC = () => (
  <div className="h-10 flex items-center justify-center">
    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-2">Генерация ссылки...</span>
  </div>
);

/**
 * Поле ввода с ссылкой и кнопкой копирования
 */
const LinkWithCopyButton: React.FC<{
  exportLink: string;
  onCopyLink: () => void;
}> = ({ exportLink, onCopyLink }) => (
  <>
    <Input
      id="export-link-input"
      value={exportLink}
      readOnly
      onClick={(e) => (e.target as HTMLInputElement).select()}
      className="font-mono text-xs"
    />
    <Button 
      onClick={onCopyLink} 
      type="button" 
      className="w-full"
      disabled={!exportLink}
    >
      <Icon name="Copy" className="mr-2 h-4 w-4" />
      Копировать ссылку
    </Button>
  </>
);

export default ShareDialogContent;
