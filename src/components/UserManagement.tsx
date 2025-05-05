
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/index";
import UserList from "./users/UserList";
import CreateUserDialog from "./users/CreateUserDialog";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Загрузка пользователей из localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleCreateUser = (newUser: Omit<User, "id">) => {
    // Проверка, существует ли уже email
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Ошибка",
        description: "Пользователь с таким email уже существует",
        variant: "destructive",
      });
      return false;
    }

    // Создание нового пользователя
    const newUserWithId: User = {
      ...newUser,
      id: Math.random().toString(36).substring(2),
    };

    const updatedUsers = [...users, newUserWithId];
    setUsers(updatedUsers);
    
    // Сохранение в localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Успешно",
      description: `Пользователь ${newUser.name} создан`,
    });
    
    setIsDialogOpen(false);
    return true;
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({
      title: "Успешно",
      description: "Пользователь удален",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Управление пользователями</h2>
        <CreateUserDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateUser={handleCreateUser}
        />
      </div>

      <UserList 
        users={users} 
        onDeleteUser={handleDeleteUser} 
      />
    </div>
  );
};

export default UserManagement;
