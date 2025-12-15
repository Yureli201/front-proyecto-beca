import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Para probar PWA en modo desarrollo
      },
      manifest: {
        name: 'Beca Digital UT',
        short_name: 'BecaApp',
        description: 'Aplicación para gestión de becas alimenticias',
        theme_color: '#166534',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo-beca.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots:[
          {
            src: 'horizontal.png',
            sizes: '2880x1214',
            type: 'image/jpg',
            form_factor: "narrow"
          },
          {
            src: 'vertical.png',
            sizes: '750x1094',
            type: 'image/jpg',
            form_factor: "wide"
          }
        ]
      }
    })
  ],
})
