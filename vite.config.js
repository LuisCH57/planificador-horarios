import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // La app se publica en luisch57.github.io/planificador-horarios/,
  // así que todas las rutas de archivos deben empezar con este prefijo
  base: '/planificador-horarios/',
})
