import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory with fallback
app.use(express.static(path.join(__dirname, 'dist'), {
  index: false // Don't serve index.html automatically
}));

// Handle SPA routing - send index.html for all routes
app.get('*', (req, res, next) => {
  // If the request is for a static file that doesn't exist, serve index.html
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);
});
