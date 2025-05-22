
import { User } from "@/types/project";

/**
 * Получает имя пользователя по ID
 * @param userId ID пользователя
 * @returns Имя пользователя или "Не назначено"
 */
export const getUserNameById = (userId: string | undefined | null): string => {
  if (!userId) return "Не назначено";
  
  try {
    // Получаем пользователей из localStorage
    const usersJson = localStorage.getItem("users");
    if (!usersJson) return userId;
    
    const users = JSON.parse(usersJson);
    if (!Array.isArray(users)) return userId;
    
    // Ищем пользователя по ID
    const user = users.find((u: User) => u.id === userId);
    
    // Возвращаем имя пользователя или его ID, если пользователь не найден
    return user ? user.name : userId;
  } catch (error) {
    console.error("Ошибка при получении имени пользователя:", error);
    return userId;
  }
};

/**
 * Получает имена пользователей по массиву ID
 * @param userIds Массив ID пользователей
 * @returns Массив имен пользователей
 */
export const getUserNamesByIds = (userIds: string[]): string[] => {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }
  
  try {
    // Получаем пользователей из localStorage
    const usersJson = localStorage.getItem("users");
    if (!usersJson) return userIds;
    
    const users = JSON.parse(usersJson);
    if (!Array.isArray(users)) return userIds;
    
    // Преобразуем массив ID в массив имен
    return userIds.map(userId => {
      const user = users.find((u: User) => u.id === userId);
      return user ? user.name : userId;
    });
  } catch (error) {
    console.error("Ошибка при получении имен пользователей:", error);
    return userIds;
  }
};

/**
 * Получает имя исполнителя задачи (поддерживает как строку, так и массив)
 * @param assignedTo Исполнитель (строка или массив)
 * @param users Массив пользователей (опционально)
 * @returns Строка с именем исполнителя или списком имен
 */
export const getAssignedUserName = (
  assignedTo: string | string[] | null | undefined,
  users?: User[]
): string => {
  if (!assignedTo) return "Не назначено";
  
  // Получаем пользователей из параметра или из localStorage
  let usersList: User[] = [];
  if (users && Array.isArray(users)) {
    usersList = users;
  } else {
    try {
      const usersJson = localStorage.getItem("users");
      if (usersJson) {
        const parsedUsers = JSON.parse(usersJson);
        if (Array.isArray(parsedUsers)) {
          usersList = parsedUsers;
        }
      }
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  }
  
  // Если assignedTo - массив, обрабатываем каждый элемент
  if (Array.isArray(assignedTo)) {
    if (assignedTo.length === 0) return "Не назначено";
    
    // Получаем имена для каждого ID
    const names = assignedTo.map(id => {
      // Пытаемся найти пользователя в списке
      const user = usersList.find(u => u.id === id);
      return user ? user.name : id;
    });
    
    // Возвращаем список имен через запятую
    return names.join(", ");
  }
  
  // Если assignedTo - строка (один исполнитель)
  // Пытаемся найти пользователя в списке
  const user = usersList.find(u => u.id === assignedTo);
  return user ? user.name : String(assignedTo);
};

/**
 * Получает имена исполнителей из массива assignedToNames
 * @param assignedToNames Массив имен или ID исполнителей
 * @returns Строка с именами исполнителей через запятую
 */
export const getAssigneeNames = (assignedToNames?: string[]): string => {
  if (!assignedToNames || !Array.isArray(assignedToNames) || assignedToNames.length === 0) {
    return "Не назначено";
  }
  
  // Преобразуем каждый элемент, пытаясь найти пользователя по ID
  const names = assignedToNames.map(name => {
    // Сначала проверяем, может ли это быть ID пользователя
    if (name && name.includes('-')) {
      const userName = getUserNameById(name);
      // Если вернулось то же значение, значит пользователь не найден по ID
      // В этом случае используем оригинальное имя
      return userName !== name ? userName : name;
    }
    return name;
  });
  
  return names.join(", ");
};

/**
 * Получает текущего пользователя из localStorage
 * @returns Объект пользователя или null
 */
export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Ошибка при получении текущего пользователя:", error);
    return null;
  }
};
