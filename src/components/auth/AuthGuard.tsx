
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Интерфейс защитника маршрутов
interface AuthGuardProps {
  requiredRole?: 'manager' | 'employee';
  redirectTo?: string;
}

/**
 * Компонент для защиты маршрутов от несанкционированного доступа
 * Проверяет наличие пользователя в localStorage и его роль
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Проверяем авторизацию пользователя
    checkUserAuthorization();
  }, [location.pathname]);

  const checkUserAuthorization = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setIsAuthorized(false);
        return;
      }

      const user = JSON.parse(userStr);
      
      // Проверяем, что пользователь аутентифицирован
      if (!user.isAuthenticated) {
        setIsAuthorized(false);
        return;
      }
      
      // Если требуется определенная роль, проверяем роль пользователя
      if (requiredRole && user.role !== requiredRole) {
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав для доступа к этой странице",
          variant: "destructive",
        });
        setIsAuthorized(false);
        return;
      }
      
      // Пользователь авторизован и имеет требуемую роль
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error checking authorization:", error);
      setIsAuthorized(false);
    }
  };

  // Пока проверяем, показываем загрузку
  if (isAuthorized === null) {
    return <div className="flex items-center justify-center min-h-screen">Проверка авторизации...</div>;
  }

  // Если авторизован - показываем защищенный контент, иначе - редирект
  return isAuthorized ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default AuthGuard;
