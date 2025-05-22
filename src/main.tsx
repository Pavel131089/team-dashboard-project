
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Находим корневой элемент
const rootElement = document.getElementById("root");

if (rootElement) {
  // Создаем корень React и рендерим приложение внутри BrowserRouter
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  
  console.log("Приложение успешно запущено");
} else {
  console.error("Корневой элемент #root не найден");
}
