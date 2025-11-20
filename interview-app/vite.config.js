import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to handle API requests
const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log(`[DEBUG] ${req.method} ${req.url}`)

      if (req.url === '/api/save-questions' && req.method === 'POST') {
        console.log('[API] Handling save-questions request')
        let body = ''

        req.on('data', chunk => {
          body += chunk.toString()
        })

        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.join(__dirname, 'src', 'data', 'questions.json')
            console.log('[API] Writing to:', filePath)

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
            console.log('[API] File saved successfully')

            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify({ success: true }))
          } catch (error) {
            console.error('[API] Error:', error)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ error: error.message }))
          }
        })
      } else {
        next()
      }
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    host: '0.0.0.0',
  },
})
