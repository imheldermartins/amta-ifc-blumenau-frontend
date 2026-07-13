import path from 'node:path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // tanstackRouter must come before react()
    tanstackRouter({
      target: 'react',
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@locales': path.resolve(__dirname, './src/locales'),
    },
  },
  server: {
    proxy: {
      // Em dev o frontend chama /api/... e o Vite repassa para o backend
      // Express (cubs-backend). Para apontar direto para outra instância,
      // defina VITE_CUBS_API_URL (ver .env.example).
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
      },
      // WebSocket do socket.io: MESMO backend da API, com upgrade de
      // protocolo (ws) — não é um servidor separado.
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
