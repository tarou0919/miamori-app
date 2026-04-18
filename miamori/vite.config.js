import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ base: '/miamori-app/',
  plugins: [react()],
})
