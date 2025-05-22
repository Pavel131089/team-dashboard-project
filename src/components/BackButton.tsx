
import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCustomNavigation } from '@/hooks/useCustomNavigation';

interface BackButtonProps {
  fallbackPath?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

/**
 * Компонент кнопки "Назад" с кастомной навигацией
 */
const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/dashboard',
  variant = 'outline',
  size = 'sm',
  className,
}) => {
  const { goBack } = useCustomNavigation();
  
  const handleBack = () => {
    // Пытаемся вернуться назад в истории
    const success = goBack();
    
    // Если не удалось вернуться назад (история пуста),
    // переходим на fallbackPath
    if (!success && fallbackPath) {
      window.location.href = fallbackPath;
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBack}
    >
      <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
      Назад
    </Button>
  );
};

export default BackButton;
