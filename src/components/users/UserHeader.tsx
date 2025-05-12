
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import CreateUserDialog from "./CreateUserDialog";
import { User } from "@/types/index";

interface UserHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onCreateUser: (user: Omit<User, "id">) => boolean;
  onExportUsers: () => void;
  hasUsers: boolean;
}

/**
 * Компонент заголовка для управления пользователями
 */
const UserHeader: React.FC<UserHeaderProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  onCreateUser,
  onExportUsers,
  hasUsers,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Управление пользователями</h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onExportUsers}
          disabled={!hasUsers}
        >
          <Icon name="Share2" className="mr-2 h-4 w-4" />
          Экспорт пользователей
        </Button>
        <CreateUserDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateUser={onCreateUser}
        />
      </div>
    </div>
  );
};

export default UserHeader;
