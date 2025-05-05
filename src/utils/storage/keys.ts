
/**
 * Константы для работы с хранилищем
 * @module storage/keys
 */

/** Ключи для основных сущностей в localStorage */
export const STORAGE_KEYS = {
  /** Проекты */
  PROJECTS: 'projects',
  /** Пользователи */
  USERS: 'users',
  /** Сессия пользователя */
  SESSION: 'user',
  /** Сообщения об ошибках аутентификации */
  AUTH_MESSAGE: 'auth_message'
};

export default STORAGE_KEYS;
