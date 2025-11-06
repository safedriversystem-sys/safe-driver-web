# Fix: Port Already in Use Error

## Problem
Firebase emulators can't start because ports 8080 and 9000 are already in use.

## Solution

### Option 1: Kill Processes Using the Ports (Recommended)

Run these commands in PowerShell:

```powershell
# Find and kill process on port 8080
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) { Stop-Process -Id $port8080.OwningProcess -Force }

# Find and kill process on port 9000
$port9000 = Get-NetTCPConnection -LocalPort 9000 -ErrorAction SilentlyContinue
if ($port9000) { Stop-Process -Id $port9000.OwningProcess -Force }

# Kill all Java processes (Firebase emulators run on Java)
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Option 2: Change Emulator Ports

If you can't kill the processes, change the ports in `firebase.json`:

```json
{
  "emulators": {
    "firestore": {
      "host": "127.0.0.1",
      "port": 8081
    },
    "database": {
      "host": "127.0.0.1",
      "port": 9001
    }
  }
}
```

Then update `lib/firebase/config.ts` to use the new ports.

### Option 3: Restart Your Computer

If nothing else works, restarting will free all ports.

## After Fixing

1. Start emulators:
   ```bash
   npm run firebase:emulators
   ```

2. Verify they're running:
   - Check http://localhost:4000 (Emulator UI)
   - Should see all emulators listed

3. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

