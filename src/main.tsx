import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

// Инициализация дефолтных пользователей при запуске приложения
import { userService } from "./services/auth/userService";
import { fixProjectDates } from "./utils/storageUtils";

// Инициализируем пользователей
userService.initializeDefaultUsers();

// Фиксируем даты проектов при запуске приложения
try {
  fixProjectDates();
} catch (error) {
  console.error("Error fixing project dates on startup:", error);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  </React.StrictMode>,
);
