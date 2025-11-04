import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    }, 
    port: 3000,
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    https: {  
      key: fs.readFileSync(path.resolve(__dirname, 'public/cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'public/cert.crt')),
    },
  },
  plugins: [
    react(),
    mkcert(),  
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,  
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, 
        runtimeCaching: [
          {
            urlPattern: /\.(png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, 
              },
            },
          }
        ]
      },
  
      manifest: {
        name: "Exoplanets",
        short_name: "Exoplanets", 
        start_url: "/RIP-25-26-Frontend/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#387ef6",
        icons: [
          {
            src: "logo.png",
             type: "image/png",
            sizes: "192x192"
          },
          {
            src: "logo.png",
             type: "image/png",
            sizes: "512x512" 
          }
        ],
      }
    })
  ],
  base: "/",
})