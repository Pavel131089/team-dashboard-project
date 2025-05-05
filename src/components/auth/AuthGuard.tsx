
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import authService, { UserRole } from "@/services/authService";

// Интерфейс защитника маршрутов
interface AuthGuardProps {
  requiredRole?: UserRole;
  redirectTo?: string;
}

/**
 * Компонент для защиты маршрутов от несанкционированного доступа
 * Проверяет наличие пользователя в localStorage и его роль
 */
const AuthGuard = ({ 
  requiredRole, 
  redirectTo = '/login' 
}: AuthGuardProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем авторизацию пользователя
    checkUserAuthorization();
  }, [location.pathname]);

  /**
   * Проверка авторизации пользователя
   */
  const checkUserAuthorization = () => {
    // Проверяем, авторизован ли пользователь
    if (!authService.isAuthenticated()) {
      authService.saveAuthErrorMessage("Требуется авторизация для доступа к этой странице");
      setIsAuthorized(false);
      return;
    }

    // Получаем текущую сессию
    const session = authService.getCurrentSession();
    if (!session) {
      authService.saveAuthErrorMessage("Сессия не найдена");
      setIsAuthorized(false);
      return;
    }
    
    // Если требуется определенная роль, проверяем роль пользователя
    if (requiredRole && session.role !== requiredRole) {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав для доступа к этой странице",
        variant: "destructive",
      });
      
      // Перенаправляем на правильную страницу в зависимости от роли
      redirectToCorrectPage(session.role);
      return;
    }
    
    // Пользователь авторизован и имеет требуемую роль
    setIsAuthorized(true);
  };

  /**
   * Перенаправление на страницу в соответствии с ролью пользователя
   */
  const redirectToCorrectPage = (role: UserRole) => {
    if (role === 'manager') {
      navigate('/dashboard');
    } else if (role === 'employee') {
      navigate('/employee');
    } else {
      authService.saveAuthErrorMessage("Неизвестная роль пользователя");
      setIsAuthorized(false);
    }
  };

  // Пока проверяем, показываем загрузку
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-slate-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // Если авторизован - показываем защищенный контент, иначе - редирект
  return isAuthorized ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default AuthGuard;
