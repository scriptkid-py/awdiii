import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - redirect all non-static routes to home
app.get('*', (req, res) => {
  // Check if the request is for a static file (has extension)
  const hasExtension = path.extname(req.path) !== '';
  
  if (hasExtension) {
    // If it's a static file request, send 404
    res.status(404).send('File not found');
  } else {
    // For all other routes (like /about, /profile/*, etc.), redirect to home
    res.redirect('/');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
