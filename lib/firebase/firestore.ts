import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore"
import { getFirebaseFirestore } from "./config"

// Firestore helper functions
export const firestoreService = {
  // Get a single document
  getDocument: async <T = DocumentData>(collectionName: string, documentId: string): Promise<T | null> => {
    const db = getFirebaseFirestore()
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  },

  // Get all documents from a collection
  getCollection: async <T = DocumentData>(
    collectionName: string,
    constraints?: QueryConstraint[],
  ): Promise<T[]> => {
    const db = getFirebaseFirestore()
    let q = query(collection(db, collectionName))

    if (constraints && constraints.length > 0) {
      q = query(collection(db, collectionName), ...constraints)
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T))
  },

  // Create a document with auto-generated ID
  createDocument: async <T = DocumentData>(
    collectionName: string,
    data: Omit<T, "id">,
  ): Promise<string> => {
    const db = getFirebaseFirestore()
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  },

  // Create or update a document with a specific ID
  setDocument: async <T = DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<T>,
  ): Promise<void> => {
    const db = getFirebaseFirestore()
    const docRef = doc(db, collectionName, documentId)
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    )
  },

  // Update a document
  updateDocument: async <T = DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<T>,
  ): Promise<void> => {
    const db = getFirebaseFirestore()
    const docRef = doc(db, collectionName, documentId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  },

  // Delete a document
  deleteDocument: async (collectionName: string, documentId: string): Promise<void> => {
    const db = getFirebaseFirestore()
    const docRef = doc(db, collectionName, documentId)
    await deleteDoc(docRef)
  },

  // Query helpers
  where: (field: string, operator: "<" | "<=" | "==" | "!=" | ">=" | ">", value: any) =>
    where(field, operator, value),
  orderByField: (field: string, direction: "asc" | "desc" = "asc") => orderBy(field, direction),
  limitResults: (count: number) => limit(count),
}

