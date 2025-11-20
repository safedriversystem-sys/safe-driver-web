# Firebase Setup for Device: 14:85:7F:BF:40:78

## Required Firebase Structure

For device `14:85:7F:BF:40:78`, ensure your Firebase Realtime Database has this structure:

```
https://safe-driver-system-default-rtdb.firebaseio.com/
└── alerts/
    └── 14:85:7F:BF:40:78/
        └── latest/
            ├── message: "Driver face not visible for 3.01s - Complete turn away detected"
            ├── tag: "DISTRACTION_EVENT"
            ├── time: "2025-11-20T22:51:23.278832+05:30"
            └── type: "head_turn"
```

## Example JSON for Firebase Console

Paste this into Firebase Console at path `/alerts/14:85:7F:BF:40:78/latest`:

```json
{
  "message": "Driver face not visible for 3.01s - Complete turn away detected",
  "tag": "DISTRACTION_EVENT",
  "time": "2025-11-20T22:51:23.278832+05:30",
  "type": "head_turn"
}
```

## Optional: Add Device Information

For better display, also add device info at `/devices/14:85:7F:BF:40:78`:

```json
{
  "driverName": "Kamal Perera",
  "driverId": "DRV001",
  "busNumber": "NB-1234",
  "route": "Colombo - Kandy",
  "location": "Kadawatha Junction"
}
```

## Testing Steps

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/project/safe-driver-system/database/safe-driver-system-default-rtdb/data
   - Navigate to: `/alerts/14:85:7F:BF:40:78/latest`

2. **Verify Data Structure:**
   - ✅ `message` field exists and is a string
   - ✅ `tag` field exists and is a string
   - ✅ `time` field exists and is in ISO 8601 format
   - ✅ `type` field exists and is a string

3. **Check Browser Console (F12):**
   - Look for: `✅ Firebase initialized successfully`
   - Look for: `📊 Alerts data received from Firebase:`
   - Look for: `🔍 Processing device 14:85:7F:BF:40:78:`
   - Look for: `✅ Transformed alert for 14:85:7F:BF:40:78:`

4. **Verify Database Rules:**
   - Rules should allow read access to `/alerts`
   - Deploy rules: `firebase deploy --only database`

## Common Issues

### Issue: No alerts showing
**Solution:**
- Check browser console for error messages
- Verify data exists at `/alerts/14:85:7F:BF:40:78/latest`
- Ensure all 4 required fields (message, tag, time, type) are present
- Check database rules allow read access

### Issue: "No latest alert for device"
**Solution:**
- Verify the `latest` node exists under `/alerts/14:85:7F:BF:40:78/`
- Check that `latest` is an object, not an array
- Ensure `latest` contains the required fields

### Issue: Connection errors
**Solution:**
- Verify Firebase config in `lib/firebase/config.ts`
- Check database URL: `https://safe-driver-system-default-rtdb.firebaseio.com`
- Ensure database rules are deployed
- Check Network tab for WebSocket connection to Firebase

## Quick Test

To test if the connection works, add this test data in Firebase Console:

**Path:** `/alerts/14:85:7F:BF:40:78/latest`

**Data:**
```json
{
  "message": "Test alert - Driver distraction detected",
  "tag": "DISTRACTION_EVENT",
  "time": "2025-01-20T10:30:00.000000+05:30",
  "type": "head_turn"
}
```

After adding this, refresh your website's alerts page. You should see the alert appear within seconds.

