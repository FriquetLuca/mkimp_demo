import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
    ],
    server: {
      cors: true, // enable CORS for all origins
    },
  };
});
