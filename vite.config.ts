
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    hmr: {
      overlay: false // Отключаем overlay ошибок - будем показывать свои сообщения
    }
  },
  build: {
    // Выводим больше информации при сборке
    sourcemap: true,
    // Настройки оптимизации
    rollupOptions: {
      output: {
        // Разделяем код на чанки
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@/components/ui/button', 
            '@/components/ui/card',
            '@/components/ui/toast'
          ]
        }
      }
    },
    // Настройки для улучшения совместимости
    target: 'es2015', // Целевая версия ES для более широкой совместимости
    outDir: 'dist', // Явно указываем директорию сборки
  }
});
