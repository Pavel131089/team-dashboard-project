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
    return userIds.map((userId) => {
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
  users?: User[],
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
    const names = assignedTo.map((id) => {
      // Пытаемся найти пользователя в списке
      const user = usersList.find((u) => u.id === id);
      return user ? user.name : id;
    });

    // Возвращаем список имен через запятую
    return names.join(", ");
  }

  // Если assignedTo - строка (один исполнитель)
  // Пытаемся найти пользователя в списке
  const user = usersList.find((u) => u.id === assignedTo);
  return user ? user.name : String(assignedTo);
};

/**
 * Получает имена из массива идентификаторов исполнителей
 * @param assignees массив идентификаторов/имен исполнителей
 * @returns строку с именами исполнителей, разделенными запятыми
 */
export function getAssigneeNames(assignees: (string | undefined)[]): string {
  if (!assignees || !Array.isArray(assignees) || assignees.length === 0) {
    return "Не назначено";
  }

  // Фильтруем пустые значения
  const validAssignees = assignees.filter((name) => name);

  if (validAssignees.length === 0) {
    return "Не назначено";
  }

  // Получаем имена пользователей по ID, если это возможно
  try {
    // Получаем список пользователей из localStorage
    const usersJson = localStorage.getItem("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    if (Array.isArray(users) && users.length > 0) {
      // Пытаемся заменить ID на имена, если найдены соответствия
      const names = validAssignees.map((assignee) => {
        if (!assignee) return "";

        // Ищем пользователя по ID
        const user = users.find((user) => user.id === assignee);

        // Если пользователь найден, возвращаем его имя, иначе исходное значение
        return user ? user.name || assignee : assignee;
      });

      return names.join(", ");
    }
  } catch (error) {
    console.error("Ошибка при получении имен пользователей:", error);
  }

  // Если не удалось получить имена из пользователей, просто соединяем исходные значения
  return validAssignees.join(", ");
}

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
