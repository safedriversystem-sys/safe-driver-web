# 🚨 QUICK FIX: Permission Denied Error

## The Problem
You're seeing **"Permission denied"** because Firebase database rules are not deployed.

## ✅ EASIEST FIX (2 minutes):

### Step 1: Go to Firebase Console
Open this link: https://console.firebase.google.com/project/safe-driver-system/database/safe-driver-system-default-rtdb/rules

### Step 2: Copy These Rules
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

### Step 3: Paste and Publish
1. Delete all existing rules in the editor
2. Paste the rules above
3. Click **"Publish"** button (top right)
4. Wait 30 seconds

### Step 4: Refresh Website
1. Go back to your website
2. Refresh the page (F5)
3. The error should be gone! ✅

## Alternative: Use Firebase CLI

If you have Firebase CLI installed:

```bash
firebase login
firebase deploy --only database
```

## Verify It Worked

After deploying:
1. Refresh your website
2. "Permission denied" error should disappear
3. You should see alerts loading
4. Check browser console - should see success messages

---

**That's it!** The rules file in your project is already correct, you just need to deploy them to Firebase.

