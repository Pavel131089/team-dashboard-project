import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import CreateUserDialog from "./CreateUserDialog";
import { User } from "@/types/index";
import UserShareButton from "./UserShareButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onCreateUser: (user: Omit<User, "id">) => boolean;
  users: User[];
}

/**
 * Компонент заголовка для управления пользователями
 */
const UserHeader: React.FC<UserHeaderProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  onCreateUser,
  users,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <h2 className="text-xl font-semibold">Управление пользователями</h2>
      <div className="flex gap-2 flex-wrap">
        <UserShareButton users={users} disabled={users.length === 0} />

        <Button onClick={() => setIsDialogOpen(true)}>
          <Icon name="UserPlus" className="mr-2 h-4 w-4" />
          Добавить пользователя
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
