# Firebase Setup Guide

This project uses Firebase for backend services including authentication, Firestore database, Realtime Database, Storage, and Cloud Messaging.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Required Services

#### Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally enable **Google** sign-in

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (or production mode with security rules)
4. Choose a location for your database

#### Realtime Database
1. Go to **Realtime Database**
2. Click "Create database"
3. Choose a location
4. Start in **test mode** (or production mode with security rules)

#### Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in **test mode** (or production mode with security rules)

#### Cloud Messaging (Optional)
1. Go to **Cloud Messaging**
2. No additional setup needed for basic usage

### 3. Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Replace the placeholder values with your actual Firebase configuration values.

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 5. Running Firebase Emulators (Local Development)

For local development, you can use Firebase Emulators instead of connecting to the production Firebase project.

#### Start Emulators

```bash
# Start all emulators
npm run firebase:emulators

# Or use Firebase CLI directly
firebase emulators:start
```

The emulators will start on the following ports:
- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080
- **Realtime Database Emulator**: http://localhost:9000
- **Storage Emulator**: http://localhost:9199
- **Emulator UI**: http://localhost:4000

#### Connect Your App to Emulators

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

When this is set to `true`, your app will automatically connect to the local emulators instead of the production Firebase project.

**Note:** Make sure the emulators are running before starting your Next.js dev server when using emulators.

### 6. Usage

Import Firebase services in your components:

```typescript
// Authentication
import { authService } from "@/lib/firebase"
const user = await authService.signIn("email@example.com", "password")

// Firestore
import { firestoreService } from "@/lib/firebase"
const users = await firestoreService.getCollection("users")

// Realtime Database
import { realtimeDbService } from "@/lib/firebase"
realtimeDbService.set("users/123", { name: "John" })

// Storage
import { storageService } from "@/lib/firebase"
const url = await storageService.uploadFile("images/photo.jpg", file)
```

## Firebase Configuration Files

The project includes the following Firebase configuration files:

- `firebase.json` - Emulator and deployment configuration
- `.firebaserc` - Firebase project configuration (update with your project ID)
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore index definitions
- `database.rules.json` - Realtime Database security rules
- `storage.rules` - Storage security rules

## Security Rules

Make sure to set up proper security rules for production:

- **Firestore**: Set up rules in Firestore Database > Rules
- **Realtime Database**: Set up rules in Realtime Database > Rules
- **Storage**: Set up rules in Storage > Rules

## Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Realtime Database](https://firebase.google.com/docs/database)
- [Cloud Storage](https://firebase.google.com/docs/storage)

