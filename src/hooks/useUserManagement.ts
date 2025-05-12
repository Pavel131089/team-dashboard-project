
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
  const [exportLink, setExportLink] = useState<string>("");

  // Загрузка пользователей из localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список пользователей",
          variant: "destructive",
        });
      }
    }
  }, []);

  // Генерация ссылки для экспорта пользователей
  useEffect(() => {
    if (users.length > 0) {
      try {
        const encodedUsers = encodeURIComponent(btoa(JSON.stringify(users)));
        const baseUrl = window.location.origin;
        const sharableLink = `${baseUrl}?users=${encodedUsers}`;
        setExportLink(sharableLink);
      } catch (error) {
        console.error("Ошибка при создании ссылки:", error);
        setExportLink("");
      }
    } else {
      setExportLink("");
    }
  }, [users]);

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

    return true;
  };

  /**
   * Удаление пользователя
   * @param userId ID пользователя для удаления
   */
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({
      title: "Успешно",
      description: "Пользователь удален",
    });
  };

  /**
   * Копировать ссылку для экспорта в буфер обмена
   */
  const copyExportLink = () => {
    if (!exportLink) {
      toast({
        title: "Ошибка",
        description: "Нет пользователей для экспорта",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard
      .writeText(exportLink)
      .then(() => {
        toast({
          title: "Успешно",
          description: "Ссылка скопирована в буфер обмена",
        });
      })
      .catch((err) => {
        console.error("Ошибка при копировании ссылки:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось скопировать ссылку",
          variant: "destructive",
        });
      });
  };

  return {
    users,
    isDialogOpen,
    setIsDialogOpen,
    exportLink,
    handleCreateUser,
    handleDeleteUser,
    copyExportLink,
  };
};
