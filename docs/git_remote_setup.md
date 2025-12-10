# Using WSL as a Remote Git Repository

You can push and pull code directly to this WSL instance from your MacBook.

## Prerequisites
- SSH access configured (see [ssh_setup.md](ssh_setup.md)).
- Git installed on your MacBook.

## 1. Clone the Repository on MacBook

From your MacBook terminal, run:

```bash
# Replace <WINDOWS_IP> with your Windows PC's IP address
# Replace 2222 with the forwarded port
git clone ssh://m0n0@<WINDOWS_IP>:2222/home/m0n0/rv_prox my_proxy_project
```

## 2. Pushing Changes

You can push changes from your Mac to this WSL instance.

```bash
git push origin master
```

### Important: The "updateInstead" Configuration
This repository is configured with `receive.denyCurrentBranch = updateInstead`.
This means **you can push to the currently checked-out branch** on WSL, BUT **only if the working tree on WSL is clean** (no uncommitted changes).

If you have uncommitted changes on WSL, the push from your Mac will be rejected to prevent overwriting your work.
