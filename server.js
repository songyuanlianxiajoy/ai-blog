#!/usr/bin/env node
/**
 * server.js — 本地预览服务器（零依赖）
 * 用法：node build.js && node server.js [端口]
 * 只服务 dist/ 目录，并把 /ai-blog/ 前缀剥掉，方便验证 BASE_PATH 行为。
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const site = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.json'), 'utf8'));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const base = (site.base || '/').replace(/\/?$/, '/');

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // 去掉站点 base 前缀，模拟 GitHub Pages 的目录结构
  if (base !== '/' && urlPath.startsWith(base.slice(0, -1))) {
    urlPath = urlPath.slice(base.slice(0, -1).length) || '/';
  }

  let file = path.join(DIST, urlPath);
  if (urlPath.endsWith('/')) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');

  if (!fs.existsSync(file) || !file.startsWith(DIST)) {
    const notFound = path.join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not Found');
    return;
  }

  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`预览已启动： http://127.0.0.1:${PORT}${base}`);
});
