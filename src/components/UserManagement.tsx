import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/index";
import UserList from "./users/UserList";
import CreateUserDialog from "./users/CreateUserDialog";
import { Button } from "./ui/button";
import Icon from "./ui/icon";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportLink, setExportLink] = useState<string>("");

  useEffect(() => {
    // Загрузка пользователей из localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
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
      }
    } else {
      setExportLink("");
    }
  }, [users]);

  // Импорт пользователей из URL при загрузке страницы
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedUsers = params.get("users");

      if (encodedUsers) {
        const decodedUsers = JSON.parse(atob(decodeURIComponent(encodedUsers)));
        if (Array.isArray(decodedUsers) && decodedUsers.length > 0) {
          // Объединяем с существующими пользователями, избегая дубликатов
          const existingUsers = localStorage.getItem("users")
            ? JSON.parse(localStorage.getItem("users")!)
            : [];

          // Создаем Set из ID существующих пользователей
          const existingIds = new Set(
            existingUsers.map((user: User) => user.id),
          );

          // Фильтруем новых пользователей, исключая дубликаты
          const newUsers = decodedUsers.filter(
            (user: User) => !existingIds.has(user.id),
          );

          // Объединяем массивы
          const mergedUsers = [...existingUsers, ...newUsers];

          // Сохраняем в localStorage и устанавливаем состояние
          localStorage.setItem("users", JSON.stringify(mergedUsers));
          setUsers(mergedUsers);

          // Очищаем URL, чтобы избежать повторного импорта при обновлении страницы
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );

          toast({
            title: "Пользователи импортированы",
            description: `Добавлено ${newUsers.length} новых пользователей`,
          });
        }
      }
    } catch (error) {
      console.error("Ошибка при импорте пользователей из URL:", error);
    }
  }, []);

  const handleCreateUser = (newUser: Omit<User, "id">) => {
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

    setIsDialogOpen(false);
    return true;
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({
      title: "Успешно",
      description: "Пользователь удален",
    });
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Управление пользователями</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyExportLink}
            disabled={users.length === 0}
          >
            <Icon name="Share2" className="mr-2 h-4 w-4" />
            Экспорт пользователей
          </Button>
          <CreateUserDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onCreateUser={handleCreateUser}
          />
        </div>
      </div>

      {exportLink && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm">
          <div className="font-medium flex items-center mb-2 text-blue-800">
            <Icon name="Info" className="mr-2 h-4 w-4" />
            Инструкции по экспорту пользователей
          </div>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Нажмите кнопку "Экспорт пользователей"</li>
            <li>Отправьте скопированную ссылку другим пользователям</li>
            <li>
              Когда они откроют ссылку, пользователи будут импортированы
              автоматически
            </li>
          </ol>
        </div>
      )}

      <UserList users={users} onDeleteUser={handleDeleteUser} />
    </div>
  );
};

export default UserManagement;
