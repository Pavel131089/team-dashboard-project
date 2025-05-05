

/**
 * Утилитарные функции для форматирования данных
 */

/**
 * Форматирует дату в локальный формат
 * 
 * @param dateString - Строка с датой в ISO формате или null
 * @returns Отформатированная дата или символ "—" если дата не задана
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString();
};

/**
 * Получает имя исполнителя по его ID
 * 
 * @param assignedTo - ID исполнителя (строка, массив строк или null)
 * @param users - Массив пользователей для поиска
 * @returns Имя исполнителя или "—" если исполнитель не задан
 */
export const getAssignedUserName = (
  assignedTo: string | string[] | null | undefined, 
  users: Array<{id: string, username: string}> = []
): string => {
  if (!assignedTo) return "—";
  
  if (Array.isArray(assignedTo)) {
    return assignedTo.map(id => {
      const user = users.find(u => u.id === id);
      return user ? user.username : id;
    }).join(", ");
  }
  
  const user = users.find(u => u.id === assignedTo);
  return user ? user.username : assignedTo;
};