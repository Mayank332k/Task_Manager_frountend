import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars from .env (prefixed with VITE_)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: true,   // listen on 0.0.0.0 → accessible on local network
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET ?? 'https://task-management-backend-isc6.onrender.com',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
