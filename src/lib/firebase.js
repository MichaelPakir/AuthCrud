import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
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

const app = initializeApp(firebaseConfig)

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
})

export const auth = getAuth(app)

export default app
