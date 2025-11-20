# How to Deploy Database Rules - FIX PERMISSION DENIED ERROR

## The Problem
You're seeing "Permission denied" because the database rules are not deployed to Firebase.

## Quick Fix (Choose One Method)

### Method 1: Using Firebase Console (Easiest - No CLI needed)

1. **Go to Firebase Console:**
   - Open: https://console.firebase.google.com/project/safe-driver-system/database/safe-driver-system-default-rtdb/rules

2. **Copy and paste these rules:**
   ```json
   {
     "rules": {
       "alerts": {
         ".read": true,
         ".write": false
       },
       "devices": {
         ".read": true,
         ".write": false
       }
     }
   }
   ```

3. **Click "Publish" button** (top right)

4. **Wait 1-2 minutes** for rules to deploy

5. **Refresh your website** - the error should be gone!

### Method 2: Using Firebase CLI

1. **Install Firebase CLI** (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Deploy rules:**
   ```bash
   firebase deploy --only database
   ```

4. **Refresh your website**

## Verify Rules Are Deployed

1. Go to: https://console.firebase.google.com/project/safe-driver-system/database/safe-driver-system-default-rtdb/rules
2. You should see the rules you just published
3. Check the "Last published" timestamp - it should be recent

## After Deploying Rules

1. Refresh your website
2. The "Permission denied" error should disappear
3. Alerts should start loading
4. Check browser console - you should see success messages

## Still Having Issues?

If you still see "Permission denied" after deploying:
1. Wait 2-3 minutes (rules can take time to propagate)
2. Clear browser cache and refresh
3. Check Firebase Console rules page to confirm they're published
4. Verify you're using the correct Firebase project

