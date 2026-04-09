// src/lib/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'  // Add later when needed
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyD4HKhyDFsca7FvK-9GDgBEtTMH_N3U950',
  authDomain: 'rizz-8cf04.firebaseapp.com',
  projectId: 'rizz-8cf04',
  storageBucket: 'rizz-8cf04.firebasestorage.app',
  messagingSenderId: '217399581970',
  appId: '1:217399581970:web:4f5c10d0c079df4e7de7cb',
  measurementId: 'G-ZCBZWGKSV0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)

export default app
