# Firebase Setup Instructions

## Quick Setup for Local Development (Using Emulators)

### Step 1: Update `.env.local` file

Your `.env.local` file should look like this for emulator mode:

```env
# Firebase Configuration (Dummy values work fine with emulators)
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key-12345
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://demo-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Use Firebase Emulators for local development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

**Important:** Make sure `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` is set!

### Step 2: Start Firebase Emulators

Open a terminal and run:

```bash
npm run firebase:emulators
```

Keep this terminal running. You should see output like:
```
✔  All emulators ready! It is now safe to connect.
```

### Step 3: Start Development Server

Open a **new terminal** and run:

```bash
npm run dev
```

### Step 4: Verify Connection

1. Open your browser to `http://localhost:3000/drivers`
2. Try adding a driver
3. Check the Emulator UI at `http://localhost:4000` to see if the driver was saved

## Using Real Firebase (Production)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### Step 2: Enable Firestore

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location

### Step 3: Get Your Firebase Config

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app
5. Copy the configuration values

### Step 4: Update `.env.local`

Replace the dummy values with your real Firebase credentials:

```env
# Firebase Configuration (Real values from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your-real-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Use real Firebase (not emulators)
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

### Step 5: Update Firestore Security Rules

Go to **Firestore Database** > **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for development (update for production!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Warning:** The above rules allow anyone to read/write. Update for production!

### Step 6: Restart Dev Server

After updating `.env.local`, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then start again
npm run dev
```

## Troubleshooting

### "Firebase not configured" Error

- Make sure `.env.local` exists in the project root
- Check that all values are filled (no empty strings)
- Restart your dev server after updating `.env.local`

### "Cannot connect to Firebase" Error

**If using emulators:**
- Make sure emulators are running: `npm run firebase:emulators`
- Check that `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` in `.env.local`
- Verify emulators are accessible at `http://localhost:4000`

**If using real Firebase:**
- Check your internet connection
- Verify Firebase project is active
- Check Firestore security rules allow read/write

### Drivers Not Saving

1. Check browser console (F12) for errors
2. Check terminal where `npm run dev` is running for errors
3. Verify Firebase connection:
   - Emulators: Check `http://localhost:4000` > Firestore
   - Real Firebase: Check Firebase Console > Firestore Database

### Still Having Issues?

1. Check the terminal logs for detailed error messages
2. Verify `.env.local` file format (no quotes around values)
3. Make sure you restarted the dev server after changing `.env.local`
4. Check `SETUP_GUIDE.md` for more detailed instructions

## What Was Fixed

The following issues have been resolved:

1. ✅ Fixed import path in `driver-service.ts` to use correct Firebase module
2. ✅ Added Firebase initialization to all API routes
3. ✅ Improved error handling for Firebase configuration
4. ✅ Made Firebase config more lenient for emulator mode

Your project should now connect to Firebase properly!

