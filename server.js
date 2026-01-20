const WebSocket = require('ws');

// 환경 변수에서 포트를 가져오거나 기본값으로 8080을 사용합니다.
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
  console.log('새로운 클라이언트가 연결되었습니다.');

  ws.on('message', (message) => {
    console.log(`수신 메시지: ${message}`);
    // 받은 메시지를 그대로 되돌려줍니다 (에코)
    ws.send(`서버에서 받은 메시지: ${message}`);
  });

  ws.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });

  ws.send('웹소켓 서버에 오신 것을 환영합니다!');
});

console.log(`웹소켓 서버가 ${port} 포트에서 실행 중입니다.`);
