# SSH Configuration for WSL (MacBook Access)

This guide explains how to allow your MacBook to SSH into this WSL environment to clone and maintain the code.

## 1. Install & Start SSH Server (in WSL)

First, ensure the OpenSSH server is installed and running inside your Linux environment.

```bash
sudo apt update
sudo apt install openssh-server -y
sudo service ssh start
```

*Note: You may need to run `sudo service ssh start` every time you restart WSL, or enable it on boot.*

## 2. Configure Windows Port Forwarding

By default, WSL 2 is behind a NAT. You need to forward a port on Windows to your WSL instance.

**Step A: Get your WSL IP Address**
Run this in your WSL terminal:
```bash
hostname -I
# Example output: 172.19.231.255 (use the first one)
```

**Step B: Forward Port (Run in PowerShell as Administrator)**
We will forward Windows port `2222` to WSL port `22`.

```powershell
# Replace 172.x.x.x with your WSL IP from Step A
netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=22 connectaddress=172.x.x.x
```

*Tip: If your WSL IP changes on reboot, you will need to update this rule.*

## 3. Allow through Windows Firewall

Allow the incoming connection on port 2222.

**Run in PowerShell as Administrator:**
```powershell
New-NetFirewallRule -DisplayName "WSL SSH" -Direction Inbound -LocalPort 2222 -Protocol TCP -Action Allow
```

## 4. Connect from MacBook

Now you can connect from your Mac using your Windows PC's IP address.

1.  **Get Windows IP**: On Windows, run `ipconfig` and find your **Wireless LAN adapter Wi-Fi** IPv4 Address (e.g., `192.168.1.10`).
2.  **Connect**:
    ```bash
    # Replace 192.168.1.10 with your Windows PC IP
    ssh -p 2222 m0n0@192.168.1.10
    ```

## 5. (Optional) Key-Based Auth

To avoid typing the password every time:

1.  **On Mac**: `ssh-copy-id -p 2222 m0n0@192.168.1.10`
    *Or manually copy `~/.ssh/id_rsa.pub` from Mac to `~/.ssh/authorized_keys` in WSL.*
