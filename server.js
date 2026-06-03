// Simple local server for UMADIGI STORE
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === '/api/member-images') {
    const memberImageDir = path.join(__dirname, 'assets', 'img', 'member');
    fs.readdir(memberImageDir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ images: [] }));
        return;
      }

      const images = files
        .filter(file => /\.(png|jpe?g|webp|gif)$/i.test(file))
        .sort((a, b) => a.localeCompare(b))
        .map(file => ({
          file,
          url: `/assets/img/member/${encodeURIComponent(file)}`
        }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ images }));
    });
    return;
  }

  const filepath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const ext = path.extname(filepath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\nUMADIGI STORE is running.`);
  console.log(`Open your browser to: http://localhost:${PORT}`);
  console.log(`Store: http://localhost:${PORT}/index.html`);
  console.log(`Press Ctrl+C to stop.\n`);
});
