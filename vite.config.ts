import { loadEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html.replace(
          '<link rel="icon" type="icon" href="favicon-prod.ico" />',
          `<link rel="icon" type="icon" href="${env.VITE_FAVICON_URL}" />`
        )
      }
    }
  }

  return {
    server: { port: 8000 },
    plugins: [react(), htmlPlugin(), tsconfigPaths()]
  }
})
