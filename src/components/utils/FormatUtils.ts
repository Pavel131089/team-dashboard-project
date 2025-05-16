/**
 * Утилитарные функции для форматирования данных
 */
import { getUserNameById, getUserNamesByIds } from "@/utils/userUtils";

// Форматирование даты
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Не указана";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Некорректная дата";
  }
};

// Форматирование суммы в рубли
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Получение имени исполнителя
export const getAssignedUserName = (
  assignedTo: string | string[] | null | undefined,
  users?: any[],
): string => {
  if (!assignedTo) return "Не назначено";

  // Если передан массив пользователей, попробуем найти имя пользователя по ID
  if (users && users.length > 0) {
    if (Array.isArray(assignedTo)) {
      return assignedTo
        .map((userId) => {
          const user = users.find((u) => u.id === userId);
          return user ? user.username : userId;
        })
        .join(", ");
    } else {
      const user = users.find((u) => u.id === assignedTo);
      return user ? user.username : assignedTo;
    }
  }

  // Если пользователи не переданы, просто возвращаем ID или строку
  if (Array.isArray(assignedTo)) {
    return assignedTo.join(", ");
  }

  return assignedTo;
};
