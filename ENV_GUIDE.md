# WebSocket Server Environment Setup

To enable SSL/WSS, you should set the following environment variables.

## Using .env file
Create a `.env` file in the root directory:
```env
DOMAIN=your-domain.com
PORT=443
```

## Running via Command Line
Alternatively, you can provide them directly when starting:
```bash
DOMAIN=your-domain.com PORT=443 npm start
```

## Note on Permissions
When using port 443, you might need root privileges:
```bash
sudo DOMAIN=your-domain.com PORT=443 npm start
```

## Running with PM2
You can pass environment variables to PM2 in a few ways:

### 1. Command Line
```bash
sudo DOMAIN=your-domain.com PORT=443 pm2 start server.js --name "ws-server"
```

### 2. Using Ecosystem File (Recommended)
Create an `ecosystem.config.js` file:
```javascript
module.exports = {
  apps: [{
    name: "ws-server",
    script: "server.js",
    env: {
      DOMAIN: "your-domain.com",
      PORT: 443
    }
  }]
};
```
Then run:
```bash
sudo pm2 start ecosystem.config.js
```
