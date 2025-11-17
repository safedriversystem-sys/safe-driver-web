import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAuth, Auth } from "firebase/auth"
import { getStorage, FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "safe-driver-system.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "safe-driver-system",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "safe-driver-system.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
}

// Initialize Firebase
let app: FirebaseApp | undefined
let db: Firestore | undefined
let auth: Auth | undefined
let storage: FirebaseStorage | undefined

if (typeof window !== "undefined") {
  try {
    // Only initialize on client side
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
      console.log("Firebase initialized with project:", firebaseConfig.projectId)
    } else {
      app = getApps()[0]
    }
    
    if (app) {
      db = getFirestore(app)
      auth = getAuth(app)
      storage = getStorage(app)
      
      // Check if Firebase is properly configured
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your-api-key") {
        console.warn("⚠️ Firebase API key not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY in .env.local")
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error)
  }
}

export { app, db, auth, storage }
export default app

