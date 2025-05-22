
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  // Перенаправление на страницу входа
  const goToLogin = () => {
    navigate("/login");
  };

  // Проверяем, авторизован ли пользователь
  React.useEffect(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user && user.isAuthenticated) {
          // Если пользователь авторизован, перенаправляем его на соответствующую страницу
          navigate(user.role === "manager" ? "/dashboard" : "/employee");
        }
      }
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-primary">Система управления проектами</h1>
        <p className="text-gray-600 mb-8">
          Добро пожаловать в систему управления проектами! Пожалуйста, войдите в систему для продолжения.
        </p>
        <Button onClick={goToLogin} className="w-full">
          Войти в систему
        </Button>
        
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Для демо-доступа используйте:</p>
          <ul className="space-y-2">
            <li className="p-2 bg-gray-50 rounded">
              <strong>Руководитель:</strong> manager / manager123
            </li>
            <li className="p-2 bg-gray-50 rounded">
              <strong>Сотрудник:</strong> employee / employee123
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
