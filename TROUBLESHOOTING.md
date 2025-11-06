# Troubleshooting Guide

## Issue: "Error" and "Offline" Notification

### Problem
You're seeing an error notification that says "Error" and "Offline" when trying to add a driver or access the app.

### Root Cause
The `.env.local` file is missing or Firebase is not properly configured.

### Solution

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name and follow the setup wizard

#### Step 2: Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (closest to your users)
5. Click "Enable"

#### Step 3: Get Your Firebase Configuration
1. In Firebase Console, click the gear icon ⚙️ > **Project Settings**
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register your app (give it a nickname like "SafeDriver Web")
5. Copy the configuration values

#### Step 4: Update .env.local File
1. Open `.env.local` in the project root
2. Replace all placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (your actual key)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### Step 5: Restart the Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Quick Test
1. Open browser console (F12)
2. Check for any Firebase-related errors
3. Try adding a driver again
4. Check Firebase Console > Firestore Database to see if data is being saved

---

## Issue: Browser Shows "Offline" Status

### Problem
The browser's offline indicator shows you're offline even though you have internet.

### Solution
1. **Check your internet connection** - Try visiting other websites
2. **Check browser console** - Press F12 and look for network errors
3. **Disable offline mode** - Some browsers have an offline mode (File > Work Offline)
4. **Clear browser cache** - Sometimes cached data causes issues
5. **Try a different browser** - Test in Chrome, Firefox, or Edge

---

## Issue: "Failed to fetch drivers" Error

### Possible Causes
1. Firebase not configured
2. Firestore Database not enabled
3. Network connectivity issues
4. CORS errors

### Solution
1. **Verify Firebase configuration:**
   ```bash
   # Check if .env.local exists
   cat .env.local
   ```

2. **Check Firestore is enabled:**
   - Go to Firebase Console
   - Navigate to Firestore Database
   - Make sure it's created and active

3. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Look for specific error messages

4. **Test API endpoint:**
   ```bash
   # In browser, go to:
   http://localhost:3000/api/drivers
   # Should return an empty array [] if working
   ```

---

## Issue: Data Not Saving

### Problem
You can fill the form but clicking "Add Driver" doesn't save the data.

### Solution
1. **Check browser console for errors** (F12)
2. **Verify Firebase configuration** in `.env.local`
3. **Check Firestore security rules:**
   - Go to Firebase Console > Firestore Database > Rules
   - For development, you can use:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2025, 12, 31);
       }
     }
   }
   ```
4. **Check network tab:**
   - Press F12 > Network tab
   - Try adding a driver
   - Look for the POST request to `/api/drivers`
   - Check if it's successful (status 201) or has errors

---

## Issue: Using Firebase Emulators

### Setup Emulators
1. **Start emulators:**
   ```bash
   npm run firebase:emulators
   ```

2. **Update .env.local:**
   ```env
   NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Access Emulator UI:**
   - Go to `http://localhost:4000`
   - You can view and manage data here

---

## Common Error Messages

### "Firebase configuration missing required fields"
- **Fix:** Make sure all fields in `.env.local` are filled with actual values (not placeholders)

### "Failed to initialize Firebase"
- **Fix:** Check that your Firebase project is active and Firestore is enabled

### "Permission denied"
- **Fix:** Update Firestore security rules (see above)

### "Network request failed"
- **Fix:** Check internet connection and Firebase project status

---

## Still Having Issues?

1. **Check the logs:**
   - Browser console (F12)
   - Terminal where `npm run dev` is running
   - Firebase Console > Firestore Database

2. **Verify setup:**
   - `.env.local` exists and has correct values
   - Firebase project is active
   - Firestore Database is enabled
   - Development server is running

3. **Test with a simple API call:**
   ```bash
   curl http://localhost:3000/api/drivers
   ```

4. **Check Firebase Console:**
   - Go to Firebase Console
   - Check if any errors are shown
   - Verify your project is not suspended

---

## Quick Checklist

- [ ] `.env.local` file exists in project root
- [ ] All Firebase config values are filled (no placeholders)
- [ ] Firestore Database is enabled in Firebase Console
- [ ] Development server is running (`npm run dev`)
- [ ] Browser console shows no errors
- [ ] Internet connection is working
- [ ] Firebase project is active (not suspended)

