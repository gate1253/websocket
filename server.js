const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
require('dotenv').config();

// DOMAIN 환경 변수가 있으면 SSL 설정을 시도합니다.
const domain = process.env.DOMAIN;
const port = process.env.PORT || (domain ? 443 : 8080);

let server;
let wss;

if (domain) {
  try {
    const certPath = `/etc/letsencrypt/live/${domain}/fullchain.pem`;
    const keyPath = `/etc/letsencrypt/live/${domain}/privkey.pem`;

    const serverConfig = {
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath)
    };

    server = https.createServer(serverConfig);
    wss = new WebSocket.Server({ server });

    server.listen(port, () => {
      console.log(`WSS 보안 서버가 ${port} 포트에서 도메인 ${domain}으로 실행 중입니다.`);
    });
  } catch (error) {
    console.error('SSL 인증서 로드 실패:', error.message);
    console.error('비보안 모드로 전환을 시도하거나 관리자에게 문의하세요.');
    process.exit(1);
  }
} else {
  // 비보안 모드 (WS)
  wss = new WebSocket.Server({ port });
  console.log(`웹소켓 채팅 서버가 ${port} 포트에서 실행 중입니다. (비보안 모드)`);
}

wss.on('connection', (ws) => {
  console.log('새로운 클라이언트가 연결되었습니다.');

  ws.on('message', (message) => {
    console.log(`수신 메시지: ${message}`);

    try {
      const data = JSON.parse(message);

      // 브로드캐스팅: 나를 제외한 모든 클라이언트에게 전송
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          // 수신한 데이터를 그대로 전송 (메시지 타입 유지)
          client.send(JSON.stringify(data));
        }
      });
    } catch (e) {
      console.error('메시지 파싱 에러:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });
});
