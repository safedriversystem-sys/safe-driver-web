# Firebase Realtime Database Setup for Live Alerts

## Required Data Structure

Your Firebase Realtime Database should have the following structure at the root level:

```
https://safe-driver-system-default-rtdb.firebaseio.com/
├── alerts/
│   ├── {deviceId}/          (e.g., "14:85:7F:BF:40:78")
│   │   ├── latest/
│   │   │   ├── message: "Driver face not visible for 3.01s - Complete turn away detected"
│   │   │   ├── tag: "DISTRACTION_EVENT"
│   │   │   ├── time: "2025-11-20T22:51:23.278832+05:30"
│   │   │   └── type: "head_turn"
│   │   └── history/         (optional - for historical alerts)
│   └── {anotherDeviceId}/
│       └── latest/
│           └── ...
└── devices/                 (optional - for device information)
    ├── {deviceId}/
    │   ├── driverName: "Kamal Perera"
    │   ├── driverId: "DRV001"
    │   ├── busNumber: "NB-1234"
    │   ├── route: "Colombo - Kandy"
    │   └── location: "Kadawatha Junction"
    └── {anotherDeviceId}/
        └── ...
```

## Example JSON Structure

```json
{
  "alerts": {
    "14:85:7F:BF:40:78": {
      "latest": {
        "message": "Driver face not visible for 3.01s - Complete turn away detected",
        "tag": "DISTRACTION_EVENT",
        "time": "2025-11-20T22:51:23.278832+05:30",
        "type": "head_turn"
      }
    },
    "48:89:E7:FA:15:AE": {
      "latest": {
        "message": "Driver showing signs of drowsiness",
        "tag": "DROWSINESS_EVENT",
        "time": "2025-11-20T23:15:45.123456+05:30",
        "type": "drowsiness"
      }
    }
  },
  "devices": {
    "14:85:7F:BF:40:78": {
      "driverName": "Kamal Perera",
      "driverId": "DRV001",
      "busNumber": "NB-1234",
      "route": "Colombo - Kandy",
      "location": "Kadawatha Junction"
    },
    "48:89:E7:FA:15:AE": {
      "driverName": "Sunil Silva",
      "driverId": "DRV002",
      "busNumber": "WP-5678",
      "route": "Galle - Matara",
      "location": "Hikkaduwa"
    }
  }
}
```

## Database Rules

Make sure your Firebase Realtime Database rules allow read access. Update `database.rules.json`:

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

**Important:** For production, restrict read access to authenticated users only.

## Alert Type Mapping

The system automatically maps Firebase alert types to UI types:

| Firebase Type/Tag | UI Type | Severity |
|------------------|---------|----------|
| `head_turn`, `DISTRACTION_EVENT` | `distraction` | `high` |
| `drowsiness`, `DROWSINESS_EVENT` | `drowsiness` | `high` |
| `phone`, `PHONE_USAGE` | `phone_usage` | `medium` |
| `speed`, `SPEEDING` | `speeding` | `medium` |
| `maintenance` | `maintenance` | `low` |

## Testing

1. **Check Browser Console (F12)**: Look for these messages:
   - ✅ `Firebase initialized successfully`
   - ✅ `Firebase initialized for live alerts`
   - 🔔 `Setting up alerts listener...`
   - 📊 `Alerts data received from Firebase:`

2. **Verify Data in Firebase Console**:
   - Go to: https://console.firebase.google.com/project/safe-driver-system/database/safe-driver-system-default-rtdb/data
   - Check that `/alerts` path exists and has data
   - Verify the structure matches the example above

3. **Check Network Tab**:
   - Open browser DevTools → Network tab
   - Filter by "firebaseio.com"
   - You should see WebSocket connections to Firebase

## Troubleshooting

### No alerts showing:
1. ✅ Check Firebase console - verify data exists at `/alerts` path
2. ✅ Check browser console for error messages
3. ✅ Verify database rules allow read access
4. ✅ Check network tab for Firebase connection errors
5. ✅ Ensure device IDs in `/alerts` match device IDs in `/devices` (if using device info)

### Connection errors:
1. ✅ Verify Firebase config in `lib/firebase/config.ts`
2. ✅ Check database URL: `https://safe-driver-system-default-rtdb.firebaseio.com`
3. ✅ Ensure database rules are deployed: `firebase deploy --only database`

### Data not updating:
1. ✅ Verify WebSocket connection in Network tab
2. ✅ Check that new alerts are being written to `/alerts/{deviceId}/latest`
3. ✅ Ensure timestamp format is ISO 8601: `"2025-11-20T22:51:23.278832+05:30"`

## Required Fields

### Minimum Required (alerts will show with defaults):
- `alerts/{deviceId}/latest/message` - Alert message
- `alerts/{deviceId}/latest/tag` - Alert tag/event type
- `alerts/{deviceId}/latest/time` - ISO 8601 timestamp
- `alerts/{deviceId}/latest/type` - Alert type

### Optional (for better display):
- `devices/{deviceId}/driverName` - Driver name
- `devices/{deviceId}/driverId` - Driver ID
- `devices/{deviceId}/busNumber` - Bus/vehicle number
- `devices/{deviceId}/route` - Route information
- `devices/{deviceId}/location` - Current location

