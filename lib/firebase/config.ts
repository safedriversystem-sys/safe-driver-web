import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore"
import { getDatabase, Database, connectDatabaseEmulator } from "firebase/database"
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage"
import { getMessaging, Messaging } from "firebase/messaging"

// Firebase configuration interface
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Get Firebase configuration from environment variables
const getFirebaseConfig = (): FirebaseConfig => {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  }

  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

  // Validate required fields
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingFields = requiredFields.filter((field) => !config[field as keyof FirebaseConfig])

  if (missingFields.length > 0) {
    console.warn(
      `Firebase configuration missing required fields: ${missingFields.join(", ")}. Please check your .env.local file.`,
    )
  }

  return config
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined
let database: Database | undefined
let storage: FirebaseStorage | undefined
let messaging: Messaging | undefined

export const initializeFirebase = (): {
  app: FirebaseApp
  auth: Auth
  firestore: Firestore
  database: Database
  storage: FirebaseStorage
  messaging: Messaging | null
} => {
  // Return existing instances if already initialized
  if (app && auth && firestore && database && storage) {
    return {
      app,
      auth,
      firestore,
      database,
      storage,
      messaging: messaging || null,
    }
  }

  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
  } else {
    const config = getFirebaseConfig()
    app = initializeApp(config)
  }

  // Initialize services
  auth = getAuth(app)
  firestore = getFirestore(app)
  database = getDatabase(app)
  storage = getStorage(app)

  // Connect to emulators in development mode
  const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"
  
  if (useEmulators && typeof window !== "undefined") {
    try {
      // Connect to Auth Emulator (only if not already connected)
      try {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
      } catch (e) {
        // Already connected or error
      }
      
      // Connect to Firestore Emulator
      try {
        connectFirestoreEmulator(firestore, "localhost", 8080)
      } catch (e) {
        // Already connected or error
      }
      
      // Connect to Realtime Database Emulator
      try {
        connectDatabaseEmulator(database, "localhost", 9000)
      } catch (e) {
        // Already connected or error
      }
      
      // Connect to Storage Emulator
      try {
        connectStorageEmulator(storage, "localhost", 9199)
      } catch (e) {
        // Already connected or error
      }
      
      console.log("🔥 Connected to Firebase Emulators")
    } catch (error) {
      console.warn("Firebase Emulator connection error:", error)
    }
  }

  // Initialize messaging only in browser environment
  if (typeof window !== "undefined") {
    try {
      messaging = getMessaging(app)
    } catch (error) {
      console.warn("Firebase Cloud Messaging is not available:", error)
    }
  }

  return {
    app,
    auth,
    firestore,
    database,
    storage,
    messaging: messaging || null,
  }
}

// Get Firebase services (lazy initialization)
export const getFirebaseServices = () => {
  if (!app || !auth || !firestore || !database || !storage) {
    return initializeFirebase()
  }

  return {
    app,
    auth,
    firestore,
    database,
    storage,
    messaging: messaging || null,
  }
}

// Export individual service getters
export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    const services = initializeFirebase()
    return services.app
  }
  return app
}

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    const services = initializeFirebase()
    return services.auth
  }
  return auth
}

export const getFirebaseFirestore = (): Firestore => {
  if (!firestore) {
    const services = initializeFirebase()
    return services.firestore
  }
  return firestore
}

export const getFirebaseDatabase = (): Database => {
  if (!database) {
    const services = initializeFirebase()
    return services.database
  }
  return database
}

export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    const services = initializeFirebase()
    return services.storage
  }
  return storage
}

export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window === "undefined") {
    return null
  }
  if (!messaging) {
    const services = initializeFirebase()
    return services.messaging
  }
  return messaging
}

// Initialize Firebase on module load (client-side only)
if (typeof window !== "undefined") {
  initializeFirebase()
}

