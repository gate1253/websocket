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
