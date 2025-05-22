import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Используем HashRouter для совместимости
import App from "./App";
import "./index.css";

// Функция для безопасного рендеринга приложения с обработкой ошибок
const renderApp = () => {
  try {
    // Находим корневой элемент
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error("Корневой элемент #root не найден");
    }

    // Создаем корень React и рендерим приложение внутри HashRouter
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

    // Показываем сообщение об ошибке и кнопку перезагрузки
    showErrorMessage();
  }
};

// Функция для отображения сообщения об ошибке и кнопки перезагрузки
const showErrorMessage = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 20px; font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #e11d48;">Не удалось загрузить приложение</h2>
        <p style="margin-bottom: 20px;">Пожалуйста, попробуйте перезагрузить страницу или обратитесь к администратору.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #6366f1; color: white; border: none; 
          border-radius: 4px; cursor: pointer; font-size: 16px;">
          Перезагрузить
        </button>
      </div>
    `;
  }
};

// Добавляем обработчик для глобальных ошибок JavaScript
window.addEventListener("error", (event) => {
  console.error("Глобальная ошибка JavaScript:", event.error);
  // Не показываем сообщение об ошибке автоматически, чтобы не прерывать работу приложения при мелких ошибках
});

// Запускаем инициализацию приложения
renderApp();
