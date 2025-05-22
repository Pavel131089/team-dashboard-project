
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
      overlay: false // Отключает наложение ошибок, чтобы показывать только ошибки в консоли
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            'class-variance-authority'
          ]
        }
      }
    },
    target: 'es2015', // Совместимость со старыми браузерами
    sourcemap: true, // Включаем sourcemap для отладки
    minify: 'terser', // Используем terser для минификации
    cssMinify: true, // Минификация CSS
    assetsInlineLimit: 4096, // Инлайним маленькие ассеты
    outDir: 'dist', // Директория для сборки
    emptyOutDir: true, // Очищаем директорию перед сборкой
    manifest: true, // Создаем manifest.json
    ssrManifest: false, // Не создаем SSR manifest
    reportCompressedSize: false, // Отключаем отчет о размере сжатых файлов
    chunkSizeWarningLimit: 500 // Увеличиваем лимит предупреждения о размере чанка
  },
  base: '/', // Базовый путь для всех ассетов
});
