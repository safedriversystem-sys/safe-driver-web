# Quick Fix for "Error" and "Offline" Issue

## The Problem
You're seeing an "Error" and "Offline" notification because Firebase is not configured.

## Quick Solution (3 Steps)

### Step 1: Create `.env.local` file

Create a file named `.env.local` in your project root with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://demo-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

### Step 2: Start Firebase Emulators

```bash
npm run firebase:emulators
```

Keep this terminal running.

### Step 3: Restart Your Dev Server

In a new terminal:

```bash
npm run dev
```

## That's It! 

Now the app will work with local Firebase emulators. You don't need a real Firebase project for development.

## For Production

When you're ready to deploy, you'll need to:
1. Create a real Firebase project
2. Get your actual Firebase credentials
3. Update `.env.local` with real values
4. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false`

See `SETUP_GUIDE.md` for detailed instructions.

