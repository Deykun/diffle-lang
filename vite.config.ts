import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/diffle-lang/',
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
        name: "DIFFLE",
        icons: [{
          src: '/android-icon-192x192.png',
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        }]
      }
    }),
  ],
  resolve: {
    alias: {
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@const': fileURLToPath(new URL('./src/const', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      "@utils": fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@common-types': fileURLToPath(new URL('./src/types.d', import.meta.url)),
    }
  }
});
