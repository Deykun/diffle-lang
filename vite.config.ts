import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
          'jsx-control-statements'
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@const': fileURLToPath(new URL('./src/const', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
    }
  }
});
