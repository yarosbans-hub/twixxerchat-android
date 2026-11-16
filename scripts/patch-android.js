// Донастройка созданного Android-проекта: разрешения для голосовых сообщений и целевая версия Android.
// Целевая версия 34 выбрана намеренно: у Capacitor 8 при targetSdk 35 и выше принудительный режим
// «от края до края» ломает экранную клавиатуру (поле ввода уезжает под неё).
const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'android');
let problems = 0;

// 1. Разрешения: микрофон для голосовых сообщений
const manifestPath = path.join(base, 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let m = fs.readFileSync(manifestPath, 'utf8');
  for (const perm of ['android.permission.RECORD_AUDIO', 'android.permission.MODIFY_AUDIO_SETTINGS']) {
    if (!m.includes(perm)) m = m.replace('</manifest>', `    <uses-permission android:name="${perm}" />\n</manifest>`);
  }
  fs.writeFileSync(manifestPath, m);
  console.log('AndroidManifest.xml: разрешения добавлены');
} else {
  console.error('Не найден AndroidManifest.xml');
  problems++;
}

// 2. Целевая версия Android
const varsPath = path.join(base, 'variables.gradle');
if (fs.existsSync(varsPath)) {
  const v = fs.readFileSync(varsPath, 'utf8');
  if (/targetSdkVersion\s*=\s*\d+/.test(v)) {
    fs.writeFileSync(varsPath, v.replace(/targetSdkVersion\s*=\s*\d+/, 'targetSdkVersion = 34'));
    console.log('variables.gradle: targetSdkVersion = 34');
  } else {
    console.error('В variables.gradle не найден targetSdkVersion');
    problems++;
  }
} else {
  console.error('Не найден variables.gradle');
  problems++;
}
if (problems) process.exit(1);
