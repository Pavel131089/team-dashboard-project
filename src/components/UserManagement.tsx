import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
        <div className="flex">
          <Icon name="AlertTriangle" className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">
            Управление пользователями пока находится в разработке. В настоящее
            время вы можете работать с проектами в локальном режиме.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Сотрудники</h3>
              <Button size="sm" variant="outline" disabled>
                <Icon name="UserPlus" className="mr-2 h-4 w-4" />
                Добавить
              </Button>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
              <Icon name="Users" className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 text-center">
                Функция управления сотрудниками будет доступна в следующих
                обновлениях
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Роли и разрешения</h3>
              <Button size="sm" variant="outline" disabled>
                <Icon name="ShieldCheck" className="mr-2 h-4 w-4" />
                Настроить
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-3 border rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                    <Icon name="Crown" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Руководитель</p>
                    <p className="text-xs text-gray-500">Полный доступ</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded">
                  Активно
                </span>
              </div>

              <div className="p-3 border rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                    <Icon name="User" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Сотрудник</p>
                    <p className="text-xs text-gray-500">Ограниченный доступ</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 py-1 px-2 rounded">
                  Готовится
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-2">Импорт пользователей</h3>
        <p className="text-sm text-gray-500 mb-4">
          В будущих обновлениях вы сможете импортировать списки пользователей из
          файлов CSV или Excel.
        </p>
        <Button variant="outline" disabled>
          <Icon name="Upload" className="mr-2 h-4 w-4" />
          Импортировать список
        </Button>
      </div>
    </div>
  );
};

export default UserManagement;
