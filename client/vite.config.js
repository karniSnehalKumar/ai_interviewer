import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // Firebase signInWithPopup needs to read window.closed on the popup.
      // Vite's default Cross-Origin-Opener-Policy: same-origin isolates the
      // window and breaks this. Setting it to unsafe-none restores the behaviour.
      "Cross-Origin-Opener-Policy": "unsafe-none",
    },
  },
})

