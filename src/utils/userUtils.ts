
import { User } from "@/types/index";

/**
 * Получает список пользователей из localStorage
 * @returns Массив пользователей
 */
export const getUsersFromStorage = (): User[] => {
  try {
    const usersStr = localStorage.getItem("users");
    if (!usersStr) return [];
    
    const users = JSON.parse(usersStr);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return [];
  }
};

/**
 * Получает имя пользователя по ID
 * @param userId ID пользователя
 * @returns Имя пользователя или ID, если пользователь не найден
 */
export const getUserNameById = (userId: string): string => {
  try {
    const users = getUsersFromStorage();
    const user = users.find(user => user.id === userId);
    
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
  try {
    const users = getUsersFromStorage();
    
    return userIds.map(id => {
      const user = users.find(user => user.id === id);
      return user ? user.name : id;
    });
  } catch (error) {
    console.error("Ошибка при получении имен пользователей:", error);
    return userIds;
  }
};

/**
 * Получает ФИО исполнителя задачи
 * @param assignedTo ID исполнителя или массив ID
 * @returns Имя исполнителя или имена, если их несколько
 */
export const getAssigneeNames = (assignedTo: string | string[] | null | undefined): string => {
  if (!assignedTo) return "—";
  
  try {
    if (Array.isArray(assignedTo)) {
      const names = getUserNamesByIds(assignedTo);
      return names.join(", ");
    } else {
      return getUserNameById(assignedTo);
    }
  } catch (error) {
    console.error("Ошибка при получении имен исполнителей:", error);
    return Array.isArray(assignedTo) ? assignedTo.join(", ") : assignedTo;
  }
};
