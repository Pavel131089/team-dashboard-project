
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
      overlay: false // Отключаем оверлей ошибок
    }
  },
  build: {
    // Настраиваем оптимизацию сборки
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Оставляем console.log для отладки
        drop_debugger: true
      }
    },
    // Разделяем чанки для лучшей производительности
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],
          vendor: ['@radix-ui/react-icons', 'class-variance-authority', 'clsx', 'tailwind-merge']
        }
      }
    },
    // Добавляем хеш к именам файлов для кэширования
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    // Опция для минимизации влияния проблем с JavaScript
    sourcemap: true,
  },
  // Настройка для оптимизации загрузки
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
