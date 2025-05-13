import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import DatabaseConnectionTester from "@/components/database/DatabaseConnectionTester";
import CloudStorageStatus from "@/components/database/CloudStorageStatus";

/**
 * Страница статуса базы данных
 */
const DatabaseStatus = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold truncate">Статус базы данных</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Вернуться в панель управления
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Проверка соединения</h2>
            <DatabaseConnectionTester />
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Синхронизация данных</h2>
            <CloudStorageStatus />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2 flex items-center">
                <Icon name="Info" className="mr-2 h-5 w-5" />
                Информация о хранилище данных
              </h3>
              <p className="text-blue-700 text-sm mb-2">
                Локальное хранилище браузера позволяет сохранять данные о
                пользователях, проектах и задачах и работать с ними даже без
                подключения к интернету.
              </p>
              <ul className="text-blue-700 text-sm list-disc pl-5 space-y-1">
                <li>Все изменения сохраняются автоматически в localStorage</li>
                <li>Доступ к данным возможен только с текущего устройства</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DatabaseStatus;
