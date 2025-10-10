import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    define: {
      __APP_MODE__: JSON.stringify(command), // 'serve' or 'build'
    },
    base: command === 'build' ? '/mkimp_demo/' : '/',
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
      svgr({
        svgrOptions: {
          icon: true,
        },
        include: '**/*.svg?react',
      }),
    ],
    server: {
      cors: true, // enable CORS for all origins
    },
    resolve: {
      alias: {
        '@icons': fileURLToPath(new URL('./src/icons', import.meta.url)), // ✅ add this
      },
    },
  };
});
