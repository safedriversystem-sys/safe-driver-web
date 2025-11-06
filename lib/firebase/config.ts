import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getDatabase, Database } from "firebase/database"
import { getStorage, FirebaseStorage } from "firebase/storage"
import type { Messaging } from "firebase/messaging"
import type { Analytics } from "firebase/analytics"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhjbnNGQcGllHwGal2NIUPTAstnUlSwaw",
  authDomain: "safe-driver-system.firebaseapp.com",
  databaseURL: "https://safe-driver-system-default-rtdb.firebaseio.com",
  projectId: "safe-driver-system",
  storageBucket: "safe-driver-system.firebasestorage.app",
  messagingSenderId: "719842751658",
  appId: "1:719842751658:web:6a6741fea6402a70514cd3",
  measurementId: "G-EVL44XM90H"
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined
let database: Database | undefined
let storage: FirebaseStorage | undefined
let messaging: Messaging | undefined
let analytics: Analytics | undefined

export const initializeFirebase = (): {
  app: FirebaseApp
  auth: Auth
  firestore: Firestore
  database: Database
  storage: FirebaseStorage
  messaging: Messaging | null
  analytics: Analytics | null
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
      analytics: analytics || null,
    }
  }

  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
  } else {
    app = initializeApp(firebaseConfig)
  }

  // Initialize services
  auth = getAuth(app)
  firestore = getFirestore(app)
  database = getDatabase(app)
  storage = getStorage(app)

  // Note: messaging and analytics are initialized lazily when requested
  // to avoid server-side import issues

  return {
    app,
    auth,
    firestore,
    database,
    storage,
    messaging: messaging || null,
    analytics: analytics || null,
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
    analytics: analytics || null,
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
    // Ensure Firebase app is initialized
    if (!app) {
      initializeFirebase()
    }
    if (!app) return null
    
    try {
      // Dynamic import to avoid server-side bundling issues
      const { getMessaging: getMessagingFn } = require("firebase/messaging")
      messaging = getMessagingFn(app)
    } catch (error) {
      console.warn("Firebase Cloud Messaging is not available:", error)
      return null
    }
  }
  return messaging
}

export const getFirebaseAnalytics = (): Analytics | null => {
  if (typeof window === "undefined") {
    return null
  }
  if (!analytics) {
    // Ensure Firebase app is initialized
    if (!app) {
      initializeFirebase()
    }
    if (!app) return null
    
    try {
      // Dynamic import to avoid server-side bundling issues
      const { getAnalytics: getAnalyticsFn } = require("firebase/analytics")
      analytics = getAnalyticsFn(app) as Analytics
    } catch (error) {
      console.warn("Firebase Analytics is not available:", error)
      return null
    }
  }
  return analytics
}

// Note: Firebase is initialized lazily when services are accessed
// Do not initialize on module load to avoid issues with server-side rendering

