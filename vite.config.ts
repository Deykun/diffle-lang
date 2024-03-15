import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions  } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest: {
    name: "DIFFLE",
    short_name: "DIFFLE",
    description: "",
    theme_color: "#black",
    background_color: "#fff",
    start_url: "/diffle-lang/",
    display: "standalone",
    orientation: "portrait",
    icons: [
      {
        src: '/diffle-lang/android-icon-192x192.png',
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  devOptions: {
    enabled: true,
    type: "module",
  },
  workbox: {
    globPatterns: ['**/*.{js,json,css,html,ico,png,svg}'],
    runtimeCaching: [{
      urlPattern: ({ url }) => {
        console.log(url);
        return url.pathname.startsWith('/diffle-lang/dictionary');
      },
      handler: 'CacheFirst' as const,
      options: {
        cacheName: "api-cache",
        cacheableResponse: {
            statuses: [0, 200]
        }
      },
    }]
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/diffle-lang/',
  server: {
    https: {
      // https://regery.com/en/security/ssl-tools/self-signed-certificate-generator
      key: './scripts/https/diffle-privateKey.key',
      cert: './scripts/https/diffle.crt',
    }
  },
  plugins: [
    react(),
    VitePWA(manifestForPlugin),
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
