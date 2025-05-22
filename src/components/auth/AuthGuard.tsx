import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@/hooks/useAuth";
import { sessionService } from "@/services/auth/sessionService";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * Проверяет наличие сессии пользователя и соответствие роли
 */
const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Проверяем сессию пользователя при монтировании компонента
  useEffect(() => {
    const checkAuth = () => {
      const session = sessionService.getCurrentSession();

      if (!session || !session.isAuthenticated) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setUserRole(session.role as UserRole);
    };

    checkAuth();
  }, [location.pathname]);

  // Если проверка еще не завершена, возвращаем null или лоадер
  if (isAuthenticated === null) {
    return null; // или компонент загрузки
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется определенная роль и она не совпадает с ролью пользователя
  if (requiredRole && userRole !== requiredRole) {
    // Перенаправляем на соответствующую страницу в зависимости от роли пользователя
    const redirectPath = userRole === "manager" ? "/dashboard" : "/employee";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Если все проверки пройдены, рендерим защищенный контент
  return <>{children}</>;
};

export default AuthGuard;
