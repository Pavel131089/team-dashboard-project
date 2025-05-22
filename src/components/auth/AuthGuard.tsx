import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { sessionService } from "@/services/auth/sessionService";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: "manager" | "employee";
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * Проверяет наличие сессии пользователя и соответствие роли
 */
const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const location = useLocation();

  // Получаем информацию о текущей сессии
  const session = sessionService.getCurrentSession();

  // Если пользователь не аутентифицирован, перенаправляем на страницу логина
  if (!session || !session.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется определенная роль и она не совпадает с ролью пользователя
  if (requiredRole && session.role !== requiredRole) {
    // Перенаправляем на соответствующую страницу в зависимости от роли пользователя
    const redirectPath =
      session.role === "manager" ? "/dashboard" : "/employee";
    return <Navigate to={redirectPath} replace />;
  }

  // Если все проверки пройдены, рендерим защищенный контент
  return <>{children}</>;
};

export default AuthGuard;
