
import { NavigateFunction } from "react-router-dom";
import { getUserFromStorage, removeUserFromStorage, saveLoginMessage } from "@/utils/storageUtils";

/**
 * Хук для работы с аутентификацией
 */
export function useAuth(navigate: NavigateFunction) {
  
  /**
   * Проверяет авторизацию пользователя и возвращает объект пользователя
   * @returns Объект пользователя или null, если пользователь не авторизован
   */
  const checkUserAuth = () => {
    const user = getUserFromStorage();
    
    if (!user) {
      redirectToLogin();
      return null;
    }
    
    // Проверяем, что пользователь аутентифицирован
    if (!user.isAuthenticated) {
      redirectToLogin("Сессия истекла. Пожалуйста, войдите снова.");
      return null;
    }
    
    // Если пользователь руководитель, перенаправляем на страницу руководителя
    if (user.role === 'manager') {
      navigate('/dashboard');
      return null;
    }
    
    return user;
  };
  
  /**
   * Выполняет выход пользователя из системы
   */
  const logout = () => {
    removeUserFromStorage();
    navigate("/login");
  };
  
  /**
   * Перенаправляет на страницу входа
   */
  const redirectToLogin = (message?: string) => {
    if (message) {
      saveLoginMessage(message);
    }
    removeUserFromStorage();
    navigate('/login');
  };
  
  return {
    checkUserAuth,
    logout,
    redirectToLogin
  };
}
