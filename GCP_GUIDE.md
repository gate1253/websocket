# 구글 클라우드 웹소켓 서버 배포 가이드 (Memory)

이 문서는 구글 클라우드 프리티어 인스턴스 설정 및 웹소켓 서버 배포를 위한 가이드입니다. 나중에 다시 참고할 수 있도록 저장되었습니다.

## 1. 구글 클라우드 인스턴스 설정

### 인스턴스 생성 정보
- **이름**: `websocket-server`
- **지역(Region)**: `us-central1`, `us-east1`, `us-west1` 중 하나 (프리티어 대상)
- **머신 유형**: `E2` 시리즈 -> `e2-micro` (상시 무료 티어)
- **부팅 디스크**: 표준 영구 디스크 10GB ~ 30GB (Debian/Ubuntu)

> [!NOTE]
> 인스턴스 생성 시 표시되는 **약 $6의 예상 비용**은 프리티어 할인이 적용되기 전의 가격이며, 위 조건을 충족하면 실제로는 **무료(0원)**로 처리됩니다.

## 2. 방화벽 설정
웹소켓 통신을 위해 포트를 열어야 합니다.
- **메뉴**: VPC 네트워크 > 방화벽
- **규정 이름**: `allow-websocket`
- **대상**: 모든 인스턴스
- **소스 IP 범위**: `0.0.0.0/0`
- **프로토콜 및 포트**: `tcp:8080` (또는 설정한 포트)

## 3. 서버 배포 단계 (SSH)
1. **Node.js 설치**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. **코드 설치 및 실행**:
   ```bash
   # 서버 코드가 있는 디렉토리에서
   npm install
   npm start
   ```

3. **Persistent Run (세션 종료 방지)**:
   SSH를 닫아도 서버가 계속 돌게 하려면 PM2를 사용하세요.
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "ws-server"
   pm2 save
   ```
   또는 간단하게 `nohup npm start &` 를 사용하세요.

## 4. 접속 테스트
`426 Upgrade Required` 응답이 오는 것은 **서버가 정상적으로 작동 중**이라는 아주 좋은 신호입니다! 웹소켓은 일반 HTTP가 아닌 전용 프로토콜이 필요하기 때문입니다.

**브라우저 콘솔 테스트 방법**:
1. 브라우저에서 `F12`를 눌러 개발자 도구를 엽니다.
2. `Console` 탭에 아래 코드를 입력합니다.
   - **주의**: `chrome://` 페이지나 보안이 엄격한 사이트에서는 **CSP 오류**가 발생할 수 있습니다. `about:blank`나 일반 웹사이트(구글 등)에서 시도하세요.
```javascript
const ws = new WebSocket('ws://<GCP_인스턴스_외부_IP>:8080');
ws.onopen = () => { console.log('연결됨!'); ws.send('Hello Server!'); };
ws.onmessage = (e) => console.log('받은 메시지:', e.data);
```

## 5. SSL/TLS 설정 (HTTPS/WSS)
웹소켓 보안 연결(`wss://`)을 위해 Let's Encrypt 인증서를 발급받고 적용하는 방법입니다.

### 5.1 인증서 발급 (Certbot)
1. **Certbot 설치**:
   ```bash
   sudo apt update && sudo apt install certbot
   ```
2. **인증서 발급**:
   (주의: 80 포트가 열려 있어야 하며 다른 프로세스가 사용 중이지 않아야 함)
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```
3. **인증서 경로**:
   - `/etc/letsencrypt/live/your-domain.com/fullchain.pem`
   - `/etc/letsencrypt/live/your-domain.com/privkey.pem`

### 5.2 웹소켓 서버 코드 수정 (server.js)
보안 연결을 위해 서버 코드를 다음과 같이 수정해야 합니다.

```javascript
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/your-domain.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/your-domain.com/privkey.pem')
});

const wss = new WebSocket.Server({ server });

server.listen(8080, () => {
  console.log('WSS 서버가 8080 포트에서 실행 중입니다.');
});
```

## 6. 최종 접속 주소
- **비보안**: `ws://<GCP_인스턴스_외부_IP>:8080`
- **보안**: `wss://<도메인_이름>:8080`
