
import React from "react";
import UserList from "./users/UserList";
import UserHeader from "./users/UserHeader";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

/**
 * Компонент управления пользователями
 * Позволяет создавать, удалять и экспортировать пользователей
 */
const UserManagement: React.FC = () => {
  const {
    users,
    isDialogOpen,
    setIsDialogOpen,
    handleCreateUser,
    handleDeleteUser,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки управления */}
      <UserHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onCreateUser={handleCreateUser}
        users={users}
      />

      {/* Информация о дефолтных пользователях */}
      <Alert>
        <Icon name="Info" className="h-4 w-4" />
        <AlertTitle>Важная информация</AlertTitle>
        <AlertDescription>
          Для доступа к демо-версии используйте:
          <ul className="list-disc pl-5 mt-1">
            <li>Руководитель: manager / manager123</li>
            <li>Сотрудник: employee / employee123</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Список пользователей */}
      <UserList users={users} onDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default UserManagement;
