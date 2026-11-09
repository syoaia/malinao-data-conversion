const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const rawUrl = new URL(req.url, `http://${req.headers.host}`);
  const safePath = rawUrl.pathname === '/' ? '/index.html' : rawUrl.pathname;
  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - File not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readError, fileContent) => {
      if (readError) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 - Internal server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fileContent);
    });
  });
});

server.listen(PORT, () => {
  console.log(`CSV mapper is running at http://localhost:${PORT}`);
});
