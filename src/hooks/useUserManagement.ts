
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/index";

/**
 * Хук для управления пользователями
 * @returns Объект с данными и методами для управления пользователями
 */
export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Загрузка пользователей из localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Загружает пользователей из localStorage
   */
  const loadUsers = () => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        if (Array.isArray(parsedUsers)) {
          setUsers(parsedUsers);
        } else {
          console.error("Данные пользователей не являются массивом:", parsedUsers);
          setUsers([]);
          initializeDefaultUsers();
        }
      } else {
        // Если пользователей нет, инициализируем дефолтными
        initializeDefaultUsers();
      }
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
      // В случае ошибки инициализируем дефолтными
      initializeDefaultUsers();
    }
  };

  /**
   * Инициализирует хранилище дефолтными пользователями
   */
  const initializeDefaultUsers = () => {
    const defaultUsers = [
      {
        id: "default-manager",
        name: "Менеджер",
        email: "manager",
        password: "manager123",
        role: "manager"
      },
      {
        id: "default-employee",
        name: "Сотрудник",
        email: "employee",
        password: "employee123",
        role: "employee"
      }
    ];
    
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    setUsers(defaultUsers);
    console.log("Инициализированы дефолтные пользователи");
  };

  /**
   * Создание нового пользователя
   * @param newUser Данные нового пользователя
   * @returns true если пользователь успешно создан
   */
  const handleCreateUser = (newUser: Omit<User, "id">): boolean => {
    // Проверка, существует ли уже email
    if (users.some((user) => user.email === newUser.email)) {
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
      id: crypto.randomUUID(),
    };

    const updatedUsers = [...users, newUserWithId];
    setUsers(updatedUsers);

    // Сохранение в localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast({
      title: "Успешно",
      description: `Пользователь ${newUser.name} создан`,
    });

    return true;
  };

  /**
   * Удаление пользователя
   * @param userId ID пользователя для удаления
   */
  const handleDeleteUser = (userId: string) => {
    // Проверяем, что пользователь не дефолтный
    const user = users.find(u => u.id === userId);
    if (user && (user.email === "manager" || user.email === "employee")) {
      toast({
        title: "Ошибка",
        description: "Нельзя удалить дефолтного пользователя",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({
      title: "Успешно",
      description: "Пользователь удален",
    });
  };

  return {
    users,
    isDialogOpen,
    setIsDialogOpen,
    handleCreateUser,
    handleDeleteUser,
    loadUsers,
  };
};
