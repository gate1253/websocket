const WebSocket = require('ws');

// 환경 변수에서 포트를 가져오거나 기본값으로 8080을 사용합니다.
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

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

console.log(`웹소켓 채팅 서버가 ${port} 포트에서 실행 중입니다.`);
