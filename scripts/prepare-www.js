// Собирает папку www из src/index.html. Библиотека Socket.IO кладётся рядом,
// чтобы приложение не зависело от внешнего CDN при запуске.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'www');
const src = path.join(root, 'src', 'index.html');

if (!fs.existsSync(src)) {
  console.error('Не найден src/index.html');
  process.exit(1);
}
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let html = fs.readFileSync(src, 'utf8');
const lib = path.join(root, 'node_modules', 'socket.io-client', 'dist', 'socket.io.min.js');
const cdn = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
if (fs.existsSync(lib) && html.includes(cdn)) {
  fs.copyFileSync(lib, path.join(out, 'socket.io.min.js'));
  html = html.split(cdn).join('socket.io.min.js');
  console.log('Socket.IO подключён локально');
} else {
  console.warn('Внимание: локальная копия Socket.IO не найдена, остаётся ссылка на CDN');
}
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('Готово: www/index.html');
