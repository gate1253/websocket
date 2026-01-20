export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 웹소켓 업그레이드 요청인지 확인
        const upgradeHeader = request.headers.get('Upgrade');
        if (upgradeHeader === 'websocket') {
            const backendUrl = env.BACKEND_WS_URL;
            if (!backendUrl || backendUrl.includes('<GCP_IP>')) {
                return new Response('Backend URL not configured', { status: 500 });
            }

            // 백엔드로 요청을 전달 (Upgrade 헤더 포함)
            // Cloudflare Workers는 fetch를 통해 WebSocket 업그레이드를 투명하게 전달할 수 있습니다.
            return fetch(backendUrl, {
                method: request.method,
                headers: request.headers,
                body: request.body,
                redirect: 'follow'
            });
        }

        return new Response('WSS Proxy Worker is running. Please use WebSocket to connect.', {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
};
