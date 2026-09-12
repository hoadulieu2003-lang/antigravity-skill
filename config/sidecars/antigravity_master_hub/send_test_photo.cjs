const https = require('https');
const fs = require('fs');
const path = require('path');

function getEnvVal(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const l of lines) {
      const t = l.trim();
      if (t.startsWith(key + '=')) return t.slice(key.length + 1).trim();
    }
  }
  return '';
}

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'hub_config.json'), 'utf8'));
const BOT_TOKEN = (config.bot_token && !config.bot_token.startsWith('ENV:'))
  ? config.bot_token
  : getEnvVal('TELEGRAM_BOT_TOKEN');
const chatId = 7809143825;
const photoPath = 'C:/Users/game/.gemini/antigravity-ide/brain/fd77714d-97c6-48db-9c07-b7f387af6b39/telegram_screen_1788487956329.png';

const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
const imageBuffer = fs.readFileSync(photoPath);
const filename = path.basename(photoPath);
const caption = '🖥️ Ảnh chụp màn hình máy tính thật (Đã khắc phục hoàn toàn lỗi màn hình đen!)';

const postDataHeader = Buffer.from(
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n` +
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n` +
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="photo"; filename="${filename}"\r\n` +
  `Content-Type: image/png\r\n\r\n`
);
const postDataFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
const fullBody = Buffer.concat([postDataHeader, imageBuffer, postDataFooter]);

const req = https.request({
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${BOT_TOKEN}/sendPhoto`,
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': fullBody.length
  }
}, (res) => {
  let b = '';
  res.on('data', d => b += d);
  res.on('end', () => console.log('Telegram API result:', b));
});

req.on('error', e => console.error(e));
req.write(fullBody);
req.end();
