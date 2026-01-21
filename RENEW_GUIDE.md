# Let's Encrypt Certificate Renewal Guide

## 1. 자동 갱신 및 서버 재시작 설정
인증서 갱신 시 서버를 자동으로 재시작하려면 아래 명령어를 **한 번만** 더 실행해 주세요. 이 명령어는 갱신 설정을 업데이트합니다.
```bash
sudo certbot renew --deploy-hook "sudo pm2 restart ws-server"
```

## 2. 설정 확인 방법
갱신 설정이 잘 저장되었는지 확인하려면 아래 파일을 확인해 보세요:
```bash
sudo cat /etc/letsencrypt/renewal/chat.gate1253.kro.kr.conf
```
파일 내용 중에 `renew_hook = sudo pm2 restart ws-server` 라는 줄이 보이면 성공입니다.

## 3. 작동 원리
- **자동 실행**: Certbot은 하루에 두 번 자동으로 만료 여부를 체크합니다.
- **갱신 시점**: 만료 30일 전이 되면 자동으로 갱신을 수행합니다.
- **후킹 실행**: 갱신에 성공한 순간에만 `--deploy-hook`에 등록된 `pm2 restart` 명령어가 실행되어 새 인증서를 적용합니다.
- **최근 로그 결과**: 지금 "No hooks were run"이라고 나온 이유는 아직 만료일이 많이 남아서 갱신 자체를 하지 않았기 때문입니다. 정상적인 상태입니다.
