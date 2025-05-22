
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigationManager } from '@/utils/navigationManager';

/**
 * Хук для работы с кастомной навигацией
 */
export function useCustomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Инициализируем менеджер навигации при первом рендере
  useEffect(() => {
    navigationManager.initialize();
    
    // Очистка при размонтировании
    return () => {
      navigationManager.destroy();
    };
  }, []);
  
  // Обновляем историю при изменении пути
  useEffect(() => {
    navigationManager.push(location.pathname);
  }, [location.pathname]);
  
  // Функция для навигации к определенному пути
  const navigateTo = useCallback((path: string) => {
    navigationManager.push(path);
    navigate(path);
  }, [navigate]);
  
  // Функция для возврата назад
  const goBack = useCallback(() => {
    const previousPath = navigationManager.goBack();
    
    if (previousPath) {
      navigate(previousPath);
      return true;
    }
    
    return false;
  }, [navigate]);
  
  return {
    navigateTo,
    goBack
  };
}
