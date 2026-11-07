import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// /v1 is proxied to the API, so the browser sees one origin: the session cookies (HttpOnly, SameSite) work
// without CORS, and the API's Origin check sees http://localhost:5173 (keep it in the API's CORS_ORIGINS).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/v1': { target: env.VITE_API_PROXY_TARGET || 'http://localhost:4000', changeOrigin: false },
      },
    },
  }
})