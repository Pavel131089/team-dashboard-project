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
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Проверяем сессию пользователя при монтировании компонента
  useEffect(() => {
    const checkAuth = () => {
      try {
        const session = sessionService.getCurrentSession();

        if (!session || !session.isAuthenticated) {
          setIsAuthenticated(false);
          setRedirectPath("/login");
          return;
        }

        setIsAuthenticated(true);
        setUserRole(session.role as UserRole);

        // Проверяем соответствие роли
        if (session.role !== requiredRole) {
          const path = session.role === "manager" ? "/dashboard" : "/employee";
          setRedirectPath(path);
        } else {
          // Если роль соответствует, обнуляем путь перенаправления
          setRedirectPath(null);
        }
      } catch (error) {
        console.error("Ошибка при проверке аутентификации:", error);
        setIsAuthenticated(false);
        setRedirectPath("/login");
      }
    };

    checkAuth();
  }, [requiredRole, location.pathname]);

  // Выполняем перенаправление через императивный navigate вместо Navigate
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [redirectPath, navigate]);

  // Если проверка еще не завершена, возвращаем null или лоадер
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Проверка авторизации...</div>
      </div>
    );
  }

  // Если пользователь аутентифицирован и имеет нужную роль, показываем защищенный контент
  if (isAuthenticated && userRole === requiredRole) {
    return <>{children}</>;
  }

  // По умолчанию ничего не рендерим, т.к. перенаправление выполняется через useEffect
  return null;
};

export default AuthGuard;
