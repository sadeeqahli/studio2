
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'c9d8ae21-2c44-4d6b-b5b7-2ad766d51ffe-00-1ei4bdst12pj3.worf.replit.dev',
      '.replit.dev',
      '.repl.co'
    ]
  }
})
