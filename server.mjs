import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const distPath = path.join(__dirname, 'dist');

// Check if dist folder exists
console.log('🔍 Checking build directory...');
console.log(`📁 __dirname: ${__dirname}`);
console.log(`📁 distPath: ${distPath}`);
console.log(`✅ dist exists: ${existsSync(distPath)}`);

if (existsSync(distPath)) {
  const files = readdirSync(distPath);
  console.log(`📄 Files in dist: ${files.join(', ')}`);
  console.log(`✅ index.html exists: ${existsSync(path.join(distPath, 'index.html'))}`);
} else {
  console.error('❌ ERROR: dist folder does not exist!');
}

// Serve static files with proper configuration
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    distExists: existsSync(distPath),
    indexExists: existsSync(path.join(distPath, 'index.html'))
  });
});

// SPA fallback - serve index.html for all routes that don't match static files
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log(`📄 Request for: ${req.url}`);
  
  if (!existsSync(indexPath)) {
    console.error(`❌ index.html not found at: ${indexPath}`);
    return res.status(500).send('Build files not found. Please check deployment.');
  }
  
  console.log(`✅ Serving index.html`);
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving from: ${distPath}\n`);
});
