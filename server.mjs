import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true
}));

// Handle SPA routing - send index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found. Please ensure the app is built correctly.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`Index file path: ${path.join(__dirname, 'dist', 'index.html')}`);
});
