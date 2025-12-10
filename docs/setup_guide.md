# MacBook Server Configuration Guide for Telegram Proxy

This guide will help you configure your MacBook to host the SOCKS5 proxy server so it can be accessed from outside your local network (e.g., from your phone on 4G/5G).

## Prerequisites

- **Server Port**: `1337` (default defined in `server.js`)
- **Local IP**: Your MacBook's IP address on the local network (e.g., `192.168.1.X`).

## Step 1: Allow Port through macOS Firewall

If you have the macOS Application Firewall enabled, you might need to allow the incoming connection.

1.  Open **System Settings** > **Network** > **Firewall**.
2.  If Firewall is **On**, click **Options**.
3.  Ensure "Block all incoming connections" is **unchecked**.
4.  If you run the node script from the terminal, macOS often prompts to allow the connection. Click **Allow**.

**Advanced (PF Packet Filter):**
If you need to explicitly open the port using `pf` (rarely needed for simple development unless strict firewall is on):
```bash
# Add this line to /etc/pf.conf (requires sudo)
pass in proto tcp from any to any port 1337
# Then reload pf
sudo pfctl -f /etc/pf.conf
```
*Note: Usually, simply clicking "Allow" on the popup when Node starts is sufficient.*

## Step 2: Port Forwarding (Router)

To access your proxy from the internet (e.g., Telegram on mobile data), you must forward port `1337` on your router to your MacBook's local IP.

1.  **Find your MacBook's Local IP**:
    - Run `ipconfig getifaddr en0` (for Wi-Fi) or `ipconfig getifaddr en1` in the terminal.
    - Example: `192.168.1.15`

2.  **Access Router Admin Page**:
    - Usually `http://192.168.1.1` or `http://192.168.0.1`.
    - Login with your router credentials.

3.  **Configure Port Forwarding**:
    - Look for **Port Forwarding**, **Virtual Server**, or **Gaming/Apps**.
    - Create a new rule:
        - **Service Name**: TGProxy
        - **External Port**: `1337`
        - **Internal Port**: `1337`
        - **Internal IP**: Your MacBook's IP (e.g., `192.168.1.15`)
        - **Protocol**: TCP

4.  **Save/Apply** settings.

## Step 3: Run the Server

Start your proxy server:

```bash
node server.js
```

You should see output indicating the server is listening and your detected local IP.

## Step 4: Connect via Deep Link

The server script generates a deep link.

- **On Local Network (Wi-Fi)**: Use the link with your Local IP (e.g., `192.168.1.15`).
- **From Internet (4G/5G)**: The generated link might show your Local IP. You need to **replace the IP** in the link with your **Public IP**.
    - Find your Public IP by visiting [whatismyip.com](https://www.whatismyip.com/).
    - Construct the link: `https://t.me/socks?server=YOUR_PUBLIC_IP&port=1337&user=mono&pass=1337`

## Troubleshooting

- **Cannot Connect?**
    - Check if your MacBook's IP changed (DHCP). Consider setting a **Static IP** for your MacBook in the router settings.
    - Verify the port is open using a tool like [canyouseeme.org](https://canyouseeme.org/) (check port 1337 while the server is running).
    - Ensure your ISP doesn't use CGNAT (Carrier Grade NAT), which prevents port forwarding.
