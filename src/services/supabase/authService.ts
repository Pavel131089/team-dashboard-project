
/**
 * Сервис для работы с аутентификацией через Supabase
 * 
 * ВНИМАНИЕ: Это только шаблон сервиса.
 * Требуется установка и настройка Supabase для полноценной работы.
 */
import supabaseClient from '@/config/supabase';

/**
 * Типы для работы с аутентификацией
 */
export type UserRole = "manager" | "employee";

export interface UserCredentials {
  username: string;
  password: string;
  role: UserRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Сервис аутентификации для Supabase
 */
export const authService = {
  /**
   * Регистрация нового пользователя
   */
  async register(email: string, password: string, name: string, role: UserRole): Promise<{ user: User | null; error: string | null }> {
    try {
      // В реальном коде будет примерно так:
      // const { data, error } = await supabaseClient.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: {
      //       name,
      //       role
      //     }
      //   }
      // });
      
      // if (error) throw error;
      
      // // Сохраняем дополнительные данные пользователя в таблицу profiles
      // const { error: profileError } = await supabaseClient
      //   .from('profiles')
      //   .insert([{ 
      //     id: data.user.id, 
      //     name, 
      //     role 
      //   }]);
      
      // if (profileError) throw profileError;
      
      // return { 
      //   user: { 
      //     id: data.user.id, 
      //     email: data.user.email!,
      //     name,
      //     role
      //   }, 
      //   error: null 
      // };

      // Временная заглушка
      console.log('Регистрация будет доступна после интеграции с Supabase');
      return { user: null, error: 'Функция будет доступна после интеграции с Supabase' };
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Ошибка при регистрации' 
      };
    }
  },

  /**
   * Вход пользователя
   */
  async login(credentials: UserCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      // В реальном коде будет примерно так:
      // const { data, error } = await supabaseClient.auth.signInWithPassword({
      //   email: credentials.username,
      //   password: credentials.password,
      // });
      
      // if (error) throw error;
      
      // // Получаем профиль пользователя с дополнительными данными
      // const { data: profileData, error: profileError } = await supabaseClient
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', data.user.id)
      //   .single();
      
      // if (profileError) throw profileError;
      
      // // Проверяем соответствие роли
      // if (profileData.role !== credentials.role) {
      //   throw new Error('Неверная роль пользователя');
      // }
      
      // return { 
      //   user: { 
      //     id: data.user.id, 
      //     email: data.user.email!,
      //     name: profileData.name,
      //     role: profileData.role
      //   }, 
      //   error: null 
      // };

      // Временное решение - используем существующую логику localStorage
      // В будущем этот код будет заменен на реальную авторизацию через Supabase
      return this.loginWithLocalStorage(credentials);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Ошибка при входе' 
      };
    }
  },

  /**
   * Временное решение для логина через localStorage
   * Будет удалено после интеграции с Supabase
   */
  async loginWithLocalStorage(credentials: UserCredentials): Promise<{ user: User | null; error: string | null }> {
    try {
      const { username, password, role } = credentials;
      
      // Проверяем стандартные учетные данные
      if ((username === "manager" && password === "manager123" && role === "manager") ||
          (username === "employee" && password === "employee123" && role === "employee")) {
        
        const user = {
          id: role === "manager" ? "default-manager" : "default-employee",
          name: role === "manager" ? "Менеджер" : "Сотрудник",
          email: username,
          role: role
        };
        
        // Сохраняем в localStorage как временное решение
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          username: user.name,
          role: user.role,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        }));
        
        return { user, error: null };
      }
      
      // Проверяем пользователей из localStorage
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      const user = users.find((u: any) => 
        (u.email === username || u.name === username) && 
        u.password === password && 
        u.role === role
      );
      
      if (!user) {
        return { user: null, error: "Неверные учетные данные" };
      }
      
      // Сохраняем в localStorage как временное решение
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        username: user.name,
        role: user.role,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      }));
      
      return { 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Ошибка при входе через localStorage:', error);
      return { 
        user: null, 
        error: error instanceof Error ? error.message : 'Ошибка при входе' 
      };
    }
  },

  /**
   * Выход пользователя
   */
  async logout(): Promise<{ error: string | null }> {
    try {
      // В реальном коде будет примерно так:
      // const { error } = await supabaseClient.auth.signOut();
      // if (error) throw error;
      
      // Временное решение - удаляем данные из localStorage
      localStorage.removeItem("user");
      
      return { error: null };
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      return { 
        error: error instanceof Error ? error.message : 'Ошибка при выходе' 
      };
    }
  },

  /**
   * Получение текущего пользователя
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // В реальном коде будет примерно так:
      // const { data, error } = await supabaseClient.auth.getUser();
      // if (error) throw error;
      
      // if (!data.user) return null;
      
      // // Получаем профиль пользователя с дополнительными данными
      // const { data: profileData, error: profileError } = await supabaseClient
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', data.user.id)
      //   .single();
      
      // if (profileError) throw profileError;
      
      // return { 
      //   id: data.user.id, 
      //   email: data.user.email!,
      //   name: profileData.name,
      //   role: profileData.role
      // };

      // Временное решение - получаем из localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      return { 
        id: user.id, 
        name: user.username, 
        email: user.username,  // Здесь в реальности должен быть email
        role: user.role 
      };
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      return null;
    }
  }
};

export default authService;
