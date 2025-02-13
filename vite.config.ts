import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: { port: 8000 },
    plugins: [react(), tsconfigPaths()],
    test: {
      setupFiles: ['./tests/setup.ts'],
      passWithNoTests: true,
    },
  }
})
