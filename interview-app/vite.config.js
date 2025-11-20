import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Ensure it's accessible if needed, though not strictly required for local
  },
  configureServer(server) {
    server.middlewares.use('/api/save-questions', (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            // Use absolute path to ensure correct file location
            const filePath = path.resolve(__dirname, 'src/data/questions.json');
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            console.error('Error saving questions:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save data' }));
          }
        });
      } else {
        next();
      }
    });
  }
})
