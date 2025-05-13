
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
      // Проверяем наличие параметра users в URL
      const params = new URLSearchParams(window.location.search);
      const encodedUsers = params.get("users");

      if (encodedUsers) {
        try {
          // Декодируем и парсим данные пользователей
          const decodedUsers = JSON.parse(atob(decodeURIComponent(encodedUsers)));
          
          if (Array.isArray(decodedUsers) && decodedUsers.length > 0) {
            // Получаем существующих пользователей
            const existingUsers = localStorage.getItem("users")
              ? JSON.parse(localStorage.getItem("users")!)
              : [];

            // Объединяем массивы пользователей
            const mergedUsers = [...existingUsers, ...decodedUsers];
            localStorage.setItem("users", JSON.stringify(mergedUsers));

            // Уведомляем пользователя
            toast({
              title: "Пользователи импортированы",
              description: `Импортировано ${decodedUsers.length} пользователей`,
            });

            // Очищаем URL-параметры
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } catch (error) {
          console.error("Ошибка при обработке данных пользователей:", error);
          toast({
            title: "Ошибка",
            description: "Не удалось импортировать пользователей",
            variant: "destructive",
          });
        }
      }

      // Проверяем наличие дефолтных пользователей
      ensureDefaultUsers();
    } catch (error) {
      console.error("Ошибка при импорте пользователей:", error);
    }
  }, []);

  /**
   * Обеспечивает наличие дефолтных пользователей в хранилище
   */
  const ensureDefaultUsers = () => {
    try {
      const usersStr = localStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];

      // Проверяем наличие стандартных пользователей
      let hasManager = false;
      let hasEmployee = false;

      for (const user of users) {
        if (user.email === "manager") hasManager = true;
        if (user.email === "employee") hasEmployee = true;
      }

      // Если нет стандартных пользователей, добавляем их
      if (!hasManager || !hasEmployee) {
        const updatedUsers = [...users];

        if (!hasManager) {
          updatedUsers.push({
            id: "default-manager",
            name: "Менеджер",
            email: "manager",
            password: "manager123",
            role: "manager"
          });
        }

        if (!hasEmployee) {
          updatedUsers.push({
            id: "default-employee",
            name: "Сотрудник",
            email: "employee",
            password: "employee123",
            role: "employee"
          });
        }

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        console.log("Дефолтные пользователи добавлены");
      }
    } catch (error) {
      console.error("Ошибка при проверке дефолтных пользователей:", error);
      
      // В случае ошибки инициализируем с дефолтными пользователями
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
    }
  };

  // Компонент не рендерит UI
  return null;
};

export default UserImportHandler;
