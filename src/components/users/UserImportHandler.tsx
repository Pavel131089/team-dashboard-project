
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * Компонент для обработки импорта пользователей из URL
 * Не имеет UI, только логика
 */
const UserImportHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Проверяем наличие параметра users в URL
      const params = new URLSearchParams(window.location.search);
      const encodedUsers = params.get("users");

      if (encodedUsers) {
        // Сначала декодируем uri-компонент, затем из base64
        try {
          const decodedData = decodeURIComponent(atob(encodedUsers));
          const decodedUsers = JSON.parse(decodedData);
          
          if (Array.isArray(decodedUsers) && decodedUsers.length > 0) {
            // Получаем существующих пользователей
            let existingUsers = [];
            try {
              const usersStr = localStorage.getItem("users");
              existingUsers = usersStr ? JSON.parse(usersStr) : [];
              
              // Проверяем, что существующие пользователи - это массив
              if (!Array.isArray(existingUsers)) {
                console.warn("Существующие пользователи не являются массивом, сбрасываем");
                existingUsers = [];
              }
            } catch (err) {
              console.error("Ошибка при чтении существующих пользователей:", err);
              existingUsers = [];
            }

            // Добавляем только пользователей с отсутствующими ID
            const existingIds = new Set(existingUsers.map(user => user.id));
            const newUsers = decodedUsers.filter(user => !existingIds.has(user.id));
            
            // Объединяем массивы пользователей
            const mergedUsers = [...existingUsers, ...newUsers];
            
            // Сохраняем обновленный список
            localStorage.setItem("users", JSON.stringify(mergedUsers));

            // Уведомляем пользователя
            toast.success(`Успешно импортировано ${newUsers.length} пользователей`);

            // Очищаем URL-параметры и перенаправляем на ту же страницу
            navigate(window.location.pathname, { replace: true });
          }
        } catch (error) {
          console.error("Ошибка при обработке данных пользователей:", error);
          toast.error("Не удалось импортировать пользователей. Неверный формат данных.");
          
          // Очищаем URL-параметры
          navigate(window.location.pathname, { replace: true });
        }
      }

      // Проверяем наличие дефолтных пользователей
      ensureDefaultUsers();
    } catch (error) {
      console.error("Ошибка при импорте пользователей:", error);
    }
  }, [navigate]);

  /**
   * Обеспечивает наличие дефолтных пользователей в хранилище
   */
  const ensureDefaultUsers = () => {
    try {
      const usersStr = localStorage.getItem("users");
      let users = [];
      
      try {
        users = usersStr ? JSON.parse(usersStr) : [];
        if (!Array.isArray(users)) {
          console.warn("Данные пользователей повреждены, сбрасываем");
          users = [];
        }
      } catch (e) {
        console.error("Ошибка при парсинге пользователей:", e);
        users = [];
      }

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
