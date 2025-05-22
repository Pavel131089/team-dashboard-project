
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { fixProjectDates } from "./utils/storageUtils";
import { userService } from "./services/auth/userService";

// Создаем функцию для глобальной обработки ошибок
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Глобальная ошибка:", { message, source, lineno, colno, error });
  
  // Можно показать пользователю сообщение об ошибке
  const errorContainer = document.getElementById('global-error');
  if (errorContainer) {
    errorContainer.style.display = 'block';
    errorContainer.textContent = `Произошла ошибка: ${message}. Пожалуйста, перезагрузите страницу.`;
  }
  
  return false;
};

// Функция инициализации приложения
const initializeApp = () => {
  try {
    console.log("Инициализация приложения...");
    
    // Инициализируем пользователей
    userService.initializeDefaultUsers();
    console.log("Пользователи инициализированы");
    
    // Фиксируем даты проектов при запуске приложения
    try {
      console.log("Попытка исправления дат проектов...");
      fixProjectDates();
      console.log("Даты проектов исправлены");
    } catch (error) {
      console.error("Ошибка при исправлении дат проектов:", error);
    }
    
    console.log("Монтирование React приложения...");
    
    // Находим корневой элемент
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error("Корневой элемент #root не найден");
    }
    
    // Создаем корень React и рендерим приложение
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    console.log("Приложение успешно смонтировано");
  } catch (error) {
    console.error("Критическая ошибка при инициализации приложения:", error);
    
    // Показываем пользователю сообщение об ошибке
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px; font-family: sans-serif;">
          <h2>Произошла ошибка при загрузке приложения</h2>
          <p>Пожалуйста, перезагрузите страницу или обратитесь в поддержку.</p>
          <p style="color: #666; font-size: 0.8em;">Ошибка: ${error instanceof Error ? error.message : String(error)}</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 10px;">
            Перезагрузить страницу
          </button>
        </div>
      `;
    }
  }
};

// Добавляем div для отображения глобальных ошибок
const errorDiv = document.createElement('div');
errorDiv.id = 'global-error';
errorDiv.style.display = 'none';
errorDiv.style.position = 'fixed';
errorDiv.style.top = '0';
errorDiv.style.left = '0';
errorDiv.style.right = '0';
errorDiv.style.padding = '10px';
errorDiv.style.backgroundColor = '#f44336';
errorDiv.style.color = 'white';
errorDiv.style.textAlign = 'center';
errorDiv.style.zIndex = '9999';
document.body.appendChild(errorDiv);

// Запускаем приложение после полной загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
