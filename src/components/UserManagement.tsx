
import React from "react";
import UserList from "./users/UserList";
import UserHeader from "./users/UserHeader";
import ExportInstructions from "./users/ExportInstructions";
import { useUserManagement } from "@/hooks/useUserManagement";

/**
 * Компонент управления пользователями
 * Позволяет создавать, удалять и экспортировать пользователей
 */
const UserManagement: React.FC = () => {
  const {
    users,
    isDialogOpen,
    setIsDialogOpen,
    exportLink,
    handleCreateUser,
    handleDeleteUser,
    copyExportLink,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки управления */}
      <UserHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onCreateUser={handleCreateUser}
        onExportUsers={copyExportLink}
        hasUsers={users.length > 0}
      />

      {/* Инструкции по экспорту */}
      <ExportInstructions exportLink={exportLink} />

      {/* Список пользователей */}
      <UserList users={users} onDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default UserManagement;
