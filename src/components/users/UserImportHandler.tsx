
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

          // Создаем Map из идентификаторов существующих пользователей для быстрого поиска
          const existingIdsMap = new Map();
          const existingEmailsMap = new Map();
          
          existingUsers.forEach((user: User) => {
            if (user.id) existingIdsMap.set(user.id, user);
            if (user.email) existingEmailsMap.set(user.email, user);
          });

          // Обработка пользователей из URL
          let newUsersCount = 0;
          let updatedUsersCount = 0;
          const processedUsers = [...existingUsers];
          
          decodedUsers.forEach((importedUser: any) => {
            // Проверяем наличие обязательных полей
            if (!importedUser.email || !importedUser.role) return;
            
            // Проверка по ID
            if (importedUser.id && existingIdsMap.has(importedUser.id)) {
              // Обновляем существующего пользователя
              const index = processedUsers.findIndex(u => u.id === importedUser.id);
              if (index !== -1) {
                // Сохраняем пароль, если он есть в импортируемом пользователе
                if (importedUser.password) {
                  processedUsers[index] = {
                    ...processedUsers[index],
                    ...importedUser
                  };
                } else {
                  // Иначе обновляем все кроме пароля
                  const { password } = processedUsers[index];
                  processedUsers[index] = {
                    ...importedUser,
                    password
                  };
                }
                updatedUsersCount++;
              }
            } 
            // Проверка по email
            else if (importedUser.email && existingEmailsMap.has(importedUser.email)) {
              // Обновляем существующего пользователя по email
              const index = processedUsers.findIndex(u => u.email === importedUser.email);
              if (index !== -1) {
                // Сохраняем пароль, если он есть в импортируемом пользователе
                if (importedUser.password) {
                  processedUsers[index] = {
                    ...processedUsers[index],
                    ...importedUser
                  };
                } else {
                  // Иначе обновляем все кроме пароля
                  const { password } = processedUsers[index];
                  processedUsers[index] = {
                    ...importedUser,
                    password
                  };
                }
                updatedUsersCount++;
              }
            } 
            // Новый пользователь
            else {
              // Добавляем ID, если его нет
              const userToAdd = importedUser.id 
                ? importedUser 
                : { ...importedUser, id: crypto.randomUUID() };
                
              processedUsers.push(userToAdd);
              newUsersCount++;
            }
          });

          // Обеспечиваем наличие дефолтных пользователей
          ensureDefaultUsers(processedUsers);
          
          // Сохраняем обновленный список пользователей
          localStorage.setItem("users", JSON.stringify(processedUsers));

          if (newUsersCount > 0 || updatedUsersCount > 0) {
            let message = "";
            if (newUsersCount > 0) {
              message += `Добавлено ${newUsersCount} новых пользователей. `;
            }
            if (updatedUsersCount > 0) {
              message += `Обновлено ${updatedUsersCount} существующих пользователей.`;
            }
            
            toast({
              title: "Пользователи импортированы",
              description: message.trim(),
            });
          } else {
            toast({
              title: "Информация",
              description: "Нет новых пользователей для импорта",
            });
          }

          // Очищаем URL, чтобы избежать повторного импорта при обновлении страницы
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      } else {
        // Даже если в URL нет параметров, проверяем наличие дефолтных пользователей
        ensureDefaultUsers();
      }
    } catch (error) {
      console.error("Ошибка при импорте пользователей из URL:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось импортировать пользователей из ссылки",
        variant: "destructive",
      });
      
      // Проверяем наличие дефолтных пользователей даже в случае ошибки
      ensureDefaultUsers();
    }
  }, []);

  /**
   * Добавляет дефолтных пользователей, если их нет в системе
   */
  const ensureDefaultUsers = (existingUsersList?: User[]) => {
    const existingUsers = existingUsersList || (localStorage.getItem("users")
      ? JSON.parse(localStorage.getItem("users")!)
      : []);

    // Дефолтные пользователи для демо-доступа
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

    // Создаем Map для быстрого поиска по email
    const existingEmailsMap = new Map();
    existingUsers.forEach((user: User) => {
      if (user.email) existingEmailsMap.set(user.email, user);
    });

    // Проверяем наличие каждого дефолтного пользователя
    let defaultsAdded = false;
    const processedUsers = [...existingUsers];
    
    defaultUsers.forEach(defaultUser => {
      if (!existingEmailsMap.has(defaultUser.email)) {
        // Добавляем дефолтного пользователя
        processedUsers.push(defaultUser);
        defaultsAdded = true;
      } else {
        // Обновляем существующего дефолтного пользователя
        const index = processedUsers.findIndex(u => u.email === defaultUser.email);
        if (index !== -1) {
          // Обновляем только пароль, если он отличается
          if (processedUsers[index].password !== defaultUser.password) {
            processedUsers[index].password = defaultUser.password;
            defaultsAdded = true;
          }
        }
      }
    });

    if (defaultsAdded) {
      localStorage.setItem("users", JSON.stringify(processedUsers));
      console.log("Дефолтные пользователи добавлены или обновлены");
    }

    return processedUsers;
  };

  // Компонент не рендерит UI
  return null;
};

export default UserImportHandler;
