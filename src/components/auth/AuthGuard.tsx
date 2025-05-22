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
  const [redirect, setRedirect] = useState<string | null>(null);

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

  // Отдельный useEffect для перенаправления
  useEffect(() => {
    if (isAuthenticated === false) {
      setRedirect("/login");
    } else if (
      isAuthenticated &&
      userRole &&
      requiredRole &&
      userRole !== requiredRole
    ) {
      const redirectPath = userRole === "manager" ? "/dashboard" : "/employee";
      setRedirect(redirectPath);
    }
  }, [isAuthenticated, userRole, requiredRole]);

  // Если проверка еще не завершена, возвращаем null или лоадер
  if (isAuthenticated === null) {
    return null; // или компонент загрузки
  }

  // Если нужно перенаправить пользователя
  if (redirect) {
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  // Если все проверки пройдены, рендерим защищенный контент
  return <>{children}</>;
};

export default AuthGuard;
