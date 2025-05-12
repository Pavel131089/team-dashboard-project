
import React from "react";
import Icon from "@/components/ui/icon";

interface ExportInstructionsProps {
  exportLink: string;
}

/**
 * Компонент с инструкциями по экспорту пользователей
 */
const ExportInstructions: React.FC<ExportInstructionsProps> = ({ exportLink }) => {
  if (!exportLink) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
      <div className="font-medium flex items-center mb-2 text-blue-800">
        <Icon name="Info" className="mr-2 h-4 w-4" />
        Инструкции по экспорту пользователей
      </div>
      <ol className="list-decimal list-inside space-y-1 text-blue-700">
        <li>Нажмите кнопку "Экспорт пользователей"</li>
        <li>Отправьте скопированную ссылку другим пользователям</li>
        <li>
          Когда они откроют ссылку, пользователи будут импортированы
          автоматически
        </li>
      </ol>
    </div>
  );
};

export default ExportInstructions;
