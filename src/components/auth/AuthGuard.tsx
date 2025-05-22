import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Используем useEffect вместо прямого вызова во время рендеринга
  useEffect(() => {
    // Получаем информацию о текущей сессии
    const session = sessionService.getCurrentSession();

    // Если пользователь не аутентифицирован, устанавливаем редирект на логин
    if (!session || !session.isAuthenticated) {
      setRedirectPath("/login");
      return;
    }

    // Если требуется определенная роль и она не совпадает с ролью пользователя
    if (requiredRole && session.role !== requiredRole) {
      // Перенаправляем на соответствующую страницу в зависимости от роли пользователя
      const path = session.role === "manager" ? "/dashboard" : "/employee";
      setRedirectPath(path);
      return;
    }

    // Если все проверки пройдены, сбрасываем редирект
    setRedirectPath(null);
  }, [requiredRole, location.pathname]);

  // Редирект, если нужно
  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Если все проверки пройдены, рендерим защищенный контент
  return <>{children}</>;
};

export default AuthGuard;
