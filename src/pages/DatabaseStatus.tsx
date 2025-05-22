import React from "react";
import Icon from "@/components/ui/icon";
import DatabaseConnectionTester from "@/components/database/DatabaseConnectionTester";
import CloudStorageStatus from "@/components/database/CloudStorageStatus";
import BackButton from "@/components/BackButton";

/**
 * Страница статуса базы данных
 * Содержит компоненты для проверки соединения и синхронизации данных
 */
const DatabaseStatus: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Шапка страницы */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold truncate">Статус базы данных</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Вернуться назад
            </Button>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Компонент проверки подключения к хранилищу */}
          <DatabaseConnectionTester />

          {/* Компонент синхронизации с облаком */}
          <CloudStorageStatus />
        </div>
      </main>
    </div>
  );
};

export default DatabaseStatus;
