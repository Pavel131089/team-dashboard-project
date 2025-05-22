
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Используем HashRouter для лучшей совместимости
import App from "./App";
import "./index.css";

// Находим корневой элемент
const rootElement = document.getElementById("root");

if (rootElement) {
  // Создаем корень React и рендерим приложение внутри HashRouter
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
  
  console.log("Приложение успешно запущено");
} else {
  console.error("Корневой элемент #root не найден");
}
