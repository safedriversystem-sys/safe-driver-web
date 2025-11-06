# SafeDriver Web - Setup and Usage Guide

This guide will help you set up and use the Driver and Route CRUD systems.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2.2 Enable Required Services

#### Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location for your database

#### Realtime Database (Optional)
1. Go to **Realtime Database**
2. Click "Create database"
3. Start in **test mode**

#### Storage (Optional)
1. Go to **Storage**
2. Click "Get started"
3. Start in **test mode**

### 2.3 Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 2.4 Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional: Use Firebase Emulators for local development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false
```

**Important:** Replace all placeholder values with your actual Firebase configuration values.

## Step 3: Running the Project

### Option A: Development Mode (Recommended)

```bash
# Start Next.js development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Option B: Using Firebase Emulators (Local Development)

1. Start Firebase emulators:
```bash
npm run firebase:emulators
```

2. In `.env.local`, set:
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

3. Start Next.js dev server (in another terminal):
```bash
npm run dev
```

4. Access:
   - App: `http://localhost:3000`
   - Emulator UI: `http://localhost:4000`

## Step 4: Using the Driver CRUD System

### Access the Drivers Page

Navigate to: `http://localhost:3000/drivers`

### Create a Driver

1. Click the **"Add New Driver"** button
2. Fill in the required fields:
   - **Full Name** (required)
   - **License Number** (required)
   - **Phone Number** (required)
   - **Email** (required)
   - **Bus Number** (optional)
   - **Route** (optional)
   - **Experience** (optional)
   - **Address** (optional)
3. Click **"Add Driver"**

### View Drivers

- All drivers are displayed in a list
- Use the search bar to filter by name, license, or bus number
- Use the status filter to filter by status (On Duty, Off Duty, Suspended)

### Update Driver Status

1. Find the driver in the list
2. Click **"Set On Duty"** or **"Set Off Duty"** button
3. The status will update immediately

### View Driver Details

1. Click the **"View"** button on any driver card
2. View detailed information in tabs:
   - **Profile**: Personal information
   - **Performance**: Safety score and alerts
   - **History**: Recent activity

### Delete a Driver

1. Click the **"Remove"** button on a driver card
2. Confirm the deletion

## Step 5: Using the Route CRUD System

### Access the Routes Page

Navigate to: `http://localhost:3000/routes`

### View Routes

- All routes are displayed in cards
- View statistics at the top:
  - Active Routes
  - Vehicles on Routes
  - On-Time Performance
  - Safety Incidents

### Search and Filter Routes

- Use the search bar to search by route name, start point, or end point
- Use the status filter to filter by status (Active, Inactive, Maintenance)

### View Route Details

1. Click **"View Details"** on any route card
2. See:
   - Route progress with stops
   - Route statistics
   - Active vehicles

## Step 6: API Endpoints

### Driver API Endpoints

#### Get All Drivers
```bash
GET /api/drivers
GET /api/drivers?status=on_duty
GET /api/drivers?search=kamal
```

#### Get Single Driver
```bash
GET /api/drivers/[id]
```

#### Create Driver
```bash
POST /api/drivers
Content-Type: application/json

{
  "name": "John Doe",
  "licenseNumber": "B1234567",
  "phone": "+94 77 123 4567",
  "email": "john@example.com",
  "busNumber": "NB-1234",
  "route": "Colombo - Kandy",
  "address": "123 Main St",
  "experience": "5 years"
}
```

#### Update Driver
```bash
PUT /api/drivers/[id]
Content-Type: application/json

{
  "status": "on_duty",
  "safetyScore": 95
}
```

#### Update Driver Status
```bash
PUT /api/drivers/[id]/status
Content-Type: application/json

{
  "status": "on_duty"
}
```

#### Delete Driver
```bash
DELETE /api/drivers/[id]
```

#### Get Driver Statistics
```bash
GET /api/drivers/stats
```

### Route API Endpoints

#### Get All Routes
```bash
GET /api/routes
GET /api/routes?status=active
GET /api/routes?search=colombo
```

#### Get Single Route
```bash
GET /api/routes/[id]
```

#### Create Route
```bash
POST /api/routes
Content-Type: application/json

{
  "name": "Colombo - Kandy Express",
  "startPoint": "Colombo Fort",
  "endPoint": "Kandy Central",
  "distance": 115,
  "estimatedTime": 180,
  "stops": [
    { "name": "Colombo Fort", "time": "06:00", "order": 0 },
    { "name": "Kadawatha", "time": "06:25", "order": 1 },
    { "name": "Kandy Central", "time": "09:00", "order": 2 }
  ],
  "vehicles": ["NB-1234", "NB-5678"]
}
```

#### Update Route
```bash
PUT /api/routes/[id]
Content-Type: application/json

{
  "status": "active",
  "onTimePerformance": 92
}
```

#### Update Route Status
```bash
PUT /api/routes/[id]/status
Content-Type: application/json

{
  "status": "active"
}
```

#### Delete Route
```bash
DELETE /api/routes/[id]
```

#### Get Route Statistics
```bash
GET /api/routes/stats
```

## Step 7: Testing the System

### Test Driver CRUD

1. **Create a test driver:**
   - Go to `/drivers`
   - Click "Add New Driver"
   - Fill in test data and submit

2. **Verify in Firebase:**
   - **If using Emulators** (`NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`):
     - Go to **Emulator UI**: `http://localhost:4000`
     - Click on **Firestore** in the left sidebar
     - Check the `drivers` collection
     - You should see your new driver
   - **If using Real Firebase** (`NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false`):
     - Go to **Firebase Console** > **Firestore Database**
     - Check the `drivers` collection
     - You should see your new driver

3. **Update the driver:**
   - Click "Set On Duty" on the driver card
   - Check Firebase to see the status update

4. **Delete the driver:**
   - Click "Remove" and confirm
   - Verify it's removed from Firebase

### Test Route CRUD

1. **Create a test route:**
   - Use the API endpoint to create a route
   - Or use the Firebase Console directly

2. **View the route:**
   - Go to `/routes`
   - Your route should appear in the list

## Step 8: Common Issues and Solutions

### Issue: "Firebase configuration missing required fields"

**Solution:** Make sure your `.env.local` file has all required Firebase configuration variables.

### Issue: "Failed to fetch drivers/routes"

**Solution:**
1. Check if Firebase is properly configured
2. Check if Firestore Database is enabled
3. Check browser console for detailed error messages
4. Verify your Firebase project is active

### Issue: Emulators not connecting

**Solution:**
1. Make sure emulators are running: `npm run firebase:emulators`
2. Check `.env.local` has `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`
3. Restart the Next.js dev server

### Issue: Drivers not visible in Firebase Console

**Problem:** You added a driver but can't see it in the Firebase Console.

**Solution:**
- **If `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`**: Data is saved to **local emulators**, not the real Firebase Console.
  - View your data at: `http://localhost:4000` (Emulator UI) > Firestore > `drivers` collection
  - This is normal for local development!
- **If you want to see data in the real Firebase Console**:
  1. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false` in `.env.local`
  2. Make sure you have real Firebase credentials in `.env.local`
  3. Restart your dev server
  4. Data will now be saved to your real Firebase project

### Issue: Data not persisting

**Solution:**
1. **If using emulators**: Check Emulator UI at `http://localhost:4000` > Firestore
2. **If using real Firebase**: Check Firebase Console > Firestore Database
3. Check browser console for errors
4. Verify Firestore security rules allow read/write (or emulators are running if using emulators)

## Step 9: Security Rules (Production)

Before deploying to production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Drivers collection
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Routes collection
    match /routes/{routeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Next Steps

1. **Add Authentication:** Implement user authentication to secure the API
2. **Add More Features:** 
   - Edit driver/route functionality in the UI
   - Bulk operations
   - Export data
   - Advanced filtering
3. **Deploy:** Deploy to Vercel, Netlify, or your preferred hosting platform

## Support

For issues or questions:
1. Check the browser console for errors
2. Check Firebase Console for data issues
3. Review the API responses in Network tab
4. Check the code comments in service files

## File Structure

```
lib/
  ├── driver-types.ts          # Driver TypeScript types
  ├── driver-service.ts        # Driver Firebase service
  ├── route-types.ts           # Route TypeScript types
  ├── route-service.ts         # Route Firebase service
  └── firebase/
      ├── config.ts            # Firebase configuration
      ├── auth.ts              # Authentication helpers
      ├── firestore.ts         # Firestore helpers
      └── index.ts             # Exports

app/
  ├── api/
  │   ├── drivers/
  │   │   ├── route.ts         # GET, POST /api/drivers
  │   │   ├── [id]/route.ts    # GET, PUT, DELETE /api/drivers/[id]
  │   │   ├── stats/route.ts   # GET /api/drivers/stats
  │   │   └── [id]/status/route.ts  # PUT /api/drivers/[id]/status
  │   └── routes/
  │       ├── route.ts         # GET, POST /api/routes
  │       ├── [id]/route.ts    # GET, PUT, DELETE /api/routes/[id]
  │       ├── stats/route.ts   # GET /api/routes/stats
  │       └── [id]/status/route.ts  # PUT /api/routes/[id]/status
  ├── drivers/
  │   └── page.tsx             # Drivers UI page
  └── routes/
      └── page.tsx             # Routes UI page
```

Happy coding! 🚀

