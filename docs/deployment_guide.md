# SOCKS5 Proxy Deployment Guide

## 1. Prerequisites
-   A Virtual Private Server (VPS) or a second PC.
-   Node.js installed (`sudo apt install nodejs npm` on Ubuntu).
-   Basic knowledge of terminal commands.

## 2. Setup on Remote Server

1.  **Transfer Files**: Copy `server.js` and `package.json` to the server.
    ```bash
    scp server.js package.json user@your-server-ip:~/proxy/
    ```
2.  **Install Dependencies**:
    ```bash
    cd ~/proxy
    npm install
    ```
3.  **Edit Credentials**:
    Open `server.js` and change the constants at the top:
    ```javascript
    const USERNAME = 'secureuser'; // Change this!
    const PASSWORD = 'securepassword'; // Change this!
    ```

## 3. Running the Server

### For Testing
```bash
node server.js
```

### For Production (Keep it running)
Use `pm2` (recommended) or `systemd`.
```bash
sudo npm install -g pm2
pm2 start server.js --name socks-proxy
pm2 save
```

## 4. Firewall Configuration (Important!)
You must allow traffic on the proxy port (default `1337`).

**Ubuntu (UFW):**
```bash
sudo ufw allow 1337/tcp
```

## 5. Connecting from Telegram
1.  Go to **Settings > Data and Storage > Proxy Settings**.
2.  Add Proxy.
3.  **Server**: Your VPS IP Address.
4.  **Port**: `1337`
5.  **Username**: Your configured username.
6.  **Password**: Your configured password.
