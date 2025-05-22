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
        console.log("AuthGuard: проверка сессии", session);

        if (!session || !session.isAuthenticated) {
          console.log("AuthGuard: пользователь не аутентифицирован");
          setIsAuthenticated(false);
          setRedirectPath("/login");
          return;
        }

        console.log(
          "AuthGuard: пользователь аутентифицирован, роль:",
          session.role,
        );
        setIsAuthenticated(true);
        setUserRole(session.role as UserRole);

        // Проверяем соответствие роли
        if (session.role !== requiredRole) {
          console.log(
            `AuthGuard: роль не соответствует требуемой (${requiredRole})`,
          );
          const path = session.role === "manager" ? "/dashboard" : "/employee";
          setRedirectPath(path);
        } else {
          console.log("AuthGuard: роль соответствует требуемой");
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
  }, [requiredRole]);

  // Выполняем перенаправление через императивный navigate вместо Navigate
  useEffect(() => {
    if (redirectPath) {
      console.log("AuthGuard: перенаправление на", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [redirectPath, navigate]);

  // Если проверка еще не завершена, возвращаем индикатор загрузки
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Проверка авторизации...</div>
      </div>
    );
  }

  // Если пользователь аутентифицирован и имеет нужную роль, показываем защищенный контент
  if (isAuthenticated && userRole === requiredRole) {
    console.log("AuthGuard: показываем защищенный контент");
    return <>{children}</>;
  }

  // По умолчанию показываем индикатор загрузки,
  // т.к. перенаправление выполняется через useEffect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Перенаправление...</div>
    </div>
  );
};

export default AuthGuard;
