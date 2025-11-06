# Fix: Request Timeout Error

## Quick Fix Steps

### 1. Verify Emulators Are Running
Check if Firebase emulators are running:
```bash
# Check if ports are in use
netstat -ano | findstr ":4000 :8082 :9099"
```

If not running, start them:
```bash
npm run firebase:emulators
```

### 2. Verify .env.local Configuration
Make sure `.env.local` has:
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

### 3. **IMPORTANT: Restart Your Dev Server**
The dev server must be restarted after creating/updating `.env.local`:

1. **Stop the current dev server** (Press `Ctrl+C` in the terminal where `npm run dev` is running)
2. **Start it again**:
   ```bash
   npm run dev
   ```

### 4. Test the Connection
1. Open your browser to `http://localhost:3000/drivers`
2. Try adding a driver
3. Check the Emulator UI at `http://localhost:4000` to see if the driver was saved

## Why This Happens

- Environment variables (`.env.local`) are only loaded when the Next.js server starts
- If you created/updated `.env.local` while the server was running, it won't see the changes
- The server needs to be restarted to pick up new environment variables

## Still Having Issues?

1. **Check the terminal** where `npm run dev` is running for error messages
2. **Check the browser console** (F12) for any errors
3. **Verify emulators are accessible**:
   - Emulator UI: http://localhost:4000
   - Should show all emulators running
4. **Check server logs** for Firebase connection messages:
   - Look for: `🔥 [Server] Connected to Firebase Emulators`

