import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Предупреждение о том, что функция в разработке */}
      <Alert className="bg-amber-50 border-amber-200 rounded-lg">
        <Icon name="AlertTriangle" className="h-5 w-5 text-amber-800" />
        <AlertDescription className="text-amber-800">
          Управление пользователями пока находится в разработке. В настоящее
          время вы можете работать с проектами в локальном режиме.
        </AlertDescription>
      </Alert>

      {/* Две карточки: Сотрудники и Роли */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Карточка с сотрудниками */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Сотрудники</h3>
              <Button size="sm" variant="outline" disabled>
                <Icon name="UserPlus" className="mr-2 h-4 w-4" />
                Добавить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Icon name="Users" className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-slate-500 mb-2">
                Функция управления сотрудниками будет доступна в
              </p>
              <p className="text-slate-500">следующих обновлениях</p>
            </div>
          </CardContent>
        </Card>

        {/* Карточка с ролями */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Роли и разрешения</h3>
              <Button size="sm" variant="outline" disabled>
                <Icon name="Settings" className="mr-2 h-4 w-4" />
                Настроить
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Роль руководителя */}
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                  <Icon name="Crown" className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Руководитель</p>
                  <p className="text-xs text-slate-500">Полный доступ</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Активно
              </span>
            </div>

            {/* Роль сотрудника */}
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mr-3">
                  <Icon name="User" className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Сотрудник</p>
                  <p className="text-xs text-slate-500">Ограниченный доступ</p>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                Готовится
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Секция импорта пользователей */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Импорт пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">
            В будущих обновлениях вы сможете импортировать списки пользователей
            из файлов CSV или Excel.
          </p>
          <Button variant="outline" disabled>
            <Icon name="Upload" className="mr-2 h-4 w-4" />
            Импортировать список
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
