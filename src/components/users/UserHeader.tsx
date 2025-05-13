
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import CreateUserDialog from "./CreateUserDialog";
import { User } from "@/types/index";
import UserShareButton from "./UserShareButton";

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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="UserPlus" className="mr-2 h-4 w-4" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать нового пользователя</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <UserFormFields 
                user={newUser} 
                onInputChange={handleInputChange}
                onRoleChange={handleRoleChange}
              />
              <Button 
                onClick={handleSubmit} 
                className="w-full mt-4"
              >
                Создать пользователя
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserHeader;
