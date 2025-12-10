import net from "net";
import os from "os";

const config = {
  SERVER_PORT: 1337,
  SERVER_IP: getLocalIP(),
  USERNAME: "mono",
  PASSWORD: "1337",
};

const detectedIP = getLocalIP();

// Helper to format IPv6 address from buffer
function formatIPv6(buffer) {
  const parts = [];
  for (let i = 0; i < 16; i += 2) {
    parts.push(buffer.readUInt16BE(i).toString(16));
  }
  return parts.join(":");
}

// Helper to get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if ("IPv4" !== iface.family || iface.internal) {
        continue;
      }
      return iface.address;
    }
  }
  return "127.0.0.1";
}

const server = net.createServer((socket) => {
  socket.once("data", (data) => {
    // Stage 1: SOCKS5 Identification
    if (data[0] !== 0x05) {
      console.error("Unsupported SOCKS version:", data[0]);
      socket.end();
      return;
    }

    const nMethods = data[1];
    const methods = data.slice(2, 2 + nMethods);

    // Check if client supports Method 0x02 (Username/Password)
    if (!methods.includes(0x02)) {
      console.error("Client does not support Username/Password auth");
      socket.write(Buffer.from([0x05, 0xff]));
      socket.end();
      return;
    }

    // Respond: Select Method 0x02 (Username/Password)
    socket.write(Buffer.from([0x05, 0x02]));

    // Stage 2: Authentication Negotiation
    socket.once("data", (authData) => {
      if (authData[0] !== 0x01) {
        console.error("Unsupported Auth Version:", authData[0]);
        socket.end();
        return;
      }

      const ulen = authData[1];
      const uname = authData.toString("utf8", 2, 2 + ulen);

      const plenIndex = 2 + ulen;
      const plen = authData[plenIndex];
      const passwd = authData.toString(
        "utf8",
        plenIndex + 1,
        plenIndex + 1 + plen
      );

      console.log("Authenticating...");

      if (uname !== config.USERNAME || passwd !== config.PASSWORD) {
        console.error("Authentication failed");
        socket.write(Buffer.from([0x01, 0x01]));
        socket.end();
        return;
      }

      // Respond: Success
      socket.write(Buffer.from([0x01, 0x00]));

      // Stage 3: Request Handling (CONNECT)
      socket.once("data", (requestData) => {
        if (requestData[0] !== 0x05) {
          // Should verify version again technically
        }

        const command = requestData[1];
        if (command !== 0x01) {
          // CONNECT
          console.error("Unsupported command:", command);
          socket.end();
          return;
        }

        const addressType = requestData[3];
        let targetAddress;
        let targetPort;
        let offset = 4;

        if (addressType === 0x01) {
          // IPv4
          targetAddress = requestData.slice(offset, offset + 4).join(".");
          offset += 4;
        } else if (addressType === 0x03) {
          // Domain name
          const addrLen = requestData[offset];
          offset += 1;
          targetAddress = requestData.toString(
            "utf8",
            offset,
            offset + addrLen
          );
          offset += addrLen;
        } else if (addressType === 0x04) {
          // IPv6
          targetAddress = formatIPv6(requestData.slice(offset, offset + 16));
          offset += 16;
        } else {
          console.error("Unsupported address type:", addressType);
          socket.end();
          return;
        }

        targetPort = requestData.readUInt16BE(offset);

        console.log(`Connecting to ${targetAddress}:${targetPort}`);

        const targetSocket = net.createConnection(
          targetPort,
          targetAddress,
          () => {
            // SOCKS5 Reply: Success
            const response = Buffer.from([
              0x05, 0x00, 0x00, 0x01, 0, 0, 0, 0, 0, 0,
            ]);
            socket.write(response);

            socket.pipe(targetSocket);
            targetSocket.pipe(socket);
          }
        );

        console.log(`Connected! 🟢`);

        targetSocket.on("error", (err) => {
          console.error("Target connection error:", err.message);
          try {
            socket.end();
          } catch (e) {}
        });
      });

      socket.on("error", (err) => {
        console.error("Client socket error:", err.message);
      });
    });
  });
});

server.listen(config.SERVER_PORT, () => {
  console.log(`SOCKS5 proxy server listening on port ${config.SERVER_PORT}`);
  console.log(`Authentication: ${config.USERNAME}:${config.PASSWORD}`);
  console.log("\n--> Telegram Proxy Deep Link <--");
  console.log(
    `https://t.me/socks?server=${detectedIP}&port=${config.SERVER_PORT}&user=${config.USERNAME}&pass=${config.PASSWORD}`
  );
  console.log(
    `(Note: If 'server' is 127.0.0.1, you cannot connect from another device. Use your LAN/Public IP)`
  );
});
