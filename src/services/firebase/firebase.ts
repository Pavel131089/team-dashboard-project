
/**
 * Мок для Firebase API
 * Этот файл имитирует функциональность Firebase, используя localStorage
 */

// Имитация Firestore
export const db = {
  // Это просто заглушка для имитации структуры Firebase
};

// Имитация Auth
export const auth = {
  currentUser: null,
  // Методы аутентификации имитированы через localStorage
};

/**
 * Сервис для работы с аутентификацией (имитация Firebase Auth)
 */
export const firebaseAuthService = {
  /**
   * Регистрация нового пользователя
   */
  async registerUser(email: string, password: string) {
    try {
      // Получаем существующих пользователей
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Проверяем, существует ли пользователь
      const existingUser = users.find((user: any) => user.email === email);
      if (existingUser) {
        return { 
          success: false, 
          error: 'Пользователь с таким email уже существует' 
        };
      }
      
      // Создаем нового пользователя
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        name: email.split('@')[0] || "Пользователь",
        role: "employee" // По умолчанию - сотрудник
      };
      
      // Добавляем в список
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      return { success: true, user: newUser };
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      return { 
        success: false, 
        error: 'Ошибка при регистрации' 
      };
    }
  },

  /**
   * Вход пользователя
   */
  async loginUser(email: string, password: string) {
    try {
      // Получаем существующих пользователей
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Ищем пользователя
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!user) {
        return { 
          success: false, 
          error: 'Неверный email или пароль'
        };
      }
      
      // Создаем сессию
      const sessionData = {
        id: user.id,
        username: user.name,
        role: user.role,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem("user", JSON.stringify(sessionData));
      
      return { success: true, user };
    } catch (error: any) {
      console.error("Ошибка при входе:", error);
      return { 
        success: false, 
        error: 'Ошибка при входе' 
      };
    }
  },

  /**
   * Выход пользователя
   */
  async logoutUser() {
    try {
      localStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      return { success: false, error: 'Ошибка при выходе из системы' };
    }
  },

  /**
   * Получение текущего пользователя
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};

export default { db, auth, firebaseAuthService };
