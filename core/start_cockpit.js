/**
 * ⚡ ANTIGRAVITY ENTERPRISE FLEET — COCKPIT SERVER RUNNER (DAEMON)
 * 🏛️ CHỦ QUẢN: ANH — LEAD ARCHITECT / PRODUCT OWNER
 * 
 * Khởi chạy máy chủ HTTP Cockpit Dashboard giao diện sáng Luminous Light Theme
 * Địa chỉ truy cập: http://localhost:8765
 */

const { SwarmCockpitServer } = require('./ui/SwarmCockpitServer');
const { GenerativeAGUIEngine } = require('./ui/GenerativeAGUIEngine');

async function main() {
  const engine = new GenerativeAGUIEngine('Antigravity Production Fleet');
  const server = new SwarmCockpitServer(engine);
  
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8765;
  const boundPort = await server.start(port);

  console.log('================================================================');
  console.log('⚡ ANTIGRAVITY ENTERPRISE COCKPIT SERVER IS LIVE');
  console.log(`🌐 Dashboard URL: http://localhost:${boundPort}`);
  console.log('🏛️ Founder: Anh (Lead Architect & Product Owner)');
  console.log('☀️ Theme: 100% Luminous Light Theme (Warm Paper #FAF9F6)');
  console.log('================================================================');
}

main().catch(err => {
  console.error('Lỗi khởi động Cockpit Server:', err);
  process.exit(1);
});
