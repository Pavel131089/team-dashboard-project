
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types/index";

/**
 * Интерфейс для результата генерации ссылки
 */
export interface LinkGenerationResult {
  link: string;
  error: string | null;
}

/**
 * Генерирует ссылку для экспорта пользователей
 */
export const useShareLinkGenerator = (users: User[]) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  /**
   * Генерирует ссылку для экспорта пользователей
   * @param includePasswords - Включать ли пароли в экспорт
   */
  const generateExportLink = async (includePasswords: boolean): Promise<LinkGenerationResult> => {
    setIsGenerating(true);
    
    try {
      if (!users || users.length === 0) {
        return {
          link: "",
          error: "Нет пользователей для экспорта"
        };
      }
      
      // Безопасное клонирование массива пользователей
      const usersToExport = users.map(user => {
        // Если не включаем пароли, создаем копию без пароля
        if (!includePasswords) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        // Возвращаем безопасную копию объекта
        return {...user};
      });

      // Создаем URL с закодированными данными
      const serializedData = JSON.stringify(usersToExport);
      const encodedUsers = btoa(encodeURIComponent(serializedData));
      const baseUrl = window.location.origin;
      const generatedLink = `${baseUrl}?users=${encodedUsers}`;
      
      return {
        link: generatedLink,
        error: null
      };
    } catch (error) {
      console.error("Ошибка при создании ссылки:", error);
      return {
        link: "",
        error: "Не удалось создать ссылку для экспорта"
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateExportLink,
    isGenerating
  };
};

/**
 * Копирует ссылку в буфер обмена
 * @param link - Ссылка для копирования
 * @param inputId - ID элемента input для ручного копирования (опционально)
 */
export const copyLinkToClipboard = async (link: string, inputId?: string): Promise<boolean> => {
  if (!link) {
    toast({
      title: "Ошибка",
      description: "Нет ссылки для копирования",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(link);
    
    toast({
      title: "Успешно",
      description: "Ссылка скопирована в буфер обмена",
    });
    
    return true;
  } catch (err) {
    console.error("Ошибка при копировании:", err);
    toast({
      title: "Внимание",
      description: "Не удалось скопировать ссылку автоматически. Скопируйте вручную.",
      variant: "destructive"
    });
    
    // Выделяем текст для ручного копирования, если предоставлен ID
    if (inputId) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        input.select();
      }
    }
    
    return false;
  }
};
