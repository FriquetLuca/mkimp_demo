import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    define: {
      __APP_MODE__: JSON.stringify(command), // 'serve' or 'build'
    },
    base: command === 'build' ? '/mkimp_demo/' : '/',
    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()],
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react-vendor';
              if (id.includes('zod')) return 'zod-vendor';
              if (id.includes('i18next')) return 'i18next-vendor';
              if (id.includes('js-yaml')) return 'js-yaml-vendor';
              if (id.includes('localforage')) return 'localforage-vendor';
              if (id.includes('jszip')) return 'jszip-vendor';
              if (id.includes('highlight.js')) return 'highlight-vendor';
              if (id.includes('katex')) return 'katex-vendor';
              if (id.includes('mkimp')) return 'mkimp-vendor';
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
