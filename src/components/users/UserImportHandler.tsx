
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/index";

/**
 * Компонент для обработки импорта пользователей из URL
 * Не имеет UI, только логика
 */
const UserImportHandler: React.FC = () => {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedUsers = params.get("users");

      if (encodedUsers) {
        // Декодируем и парсим данные пользователей
        const decodedUsers = JSON.parse(atob(decodeURIComponent(encodedUsers)));
        
        if (Array.isArray(decodedUsers) && decodedUsers.length > 0) {
          // Получаем существующих пользователей
          const existingUsers = localStorage.getItem("users")
            ? JSON.parse(localStorage.getItem("users")!)
            : [];

          // Создаем Set из ID существующих пользователей для быстрого поиска
          const existingIds = new Set(
            existingUsers.map((user: User) => user.id)
          );

          // Фильтруем новых пользователей, исключая дубликаты
          const newUsers = decodedUsers.filter(
            (user: User) => !existingIds.has(user.id)
          );

          if (newUsers.length > 0) {
            // Объединяем массивы и сохраняем
            const mergedUsers = [...existingUsers, ...newUsers];
            localStorage.setItem("users", JSON.stringify(mergedUsers));

            toast({
              title: "Пользователи импортированы",
              description: `Добавлено ${newUsers.length} новых пользователей`,
            });
          } else {
            toast({
              title: "Информация",
              description: "Все пользователи из ссылки уже существуют в системе",
            });
          }

          // Очищаем URL, чтобы избежать повторного импорта при обновлении страницы
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      }
    } catch (error) {
      console.error("Ошибка при импорте пользователей из URL:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось импортировать пользователей из ссылки",
        variant: "destructive",
      });
    }
  }, []);

  // Компонент не рендерит UI
  return null;
};

export default UserImportHandler;
