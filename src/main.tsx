import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Функция инициализации приложения
const initApp = () => {
  try {
    console.log("Инициализация приложения...");

    // Находим корневой элемент
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error("Корневой элемент #root не найден");
    }

    // Создаем корень React и рендерим приложение
    // Используем HashRouter вместо BrowserRouter для лучшей совместимости с хостингом
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>,
    );

    console.log("Приложение успешно запущено");
  } catch (error) {
    console.error("Критическая ошибка при инициализации приложения:", error);

    // Показываем пользователю сообщение об ошибке
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px; font-family: sans-serif;">
          <h2>Произошла ошибка при загрузке приложения</h2>
          <p>Пожалуйста, перезагрузите страницу или обратитесь в поддержку.</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 10px;">
            Перезагрузить страницу
          </button>
        </div>
      `;
    }
  }
};

// Запускаем инициализацию
initApp();
