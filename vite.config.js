import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 uses a Vite plugin instead of PostCSS + tailwind.config.js.
// Theme tokens are defined in src/index.css using @theme { ... }.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
