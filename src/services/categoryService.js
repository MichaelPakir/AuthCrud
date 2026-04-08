// src/services/categoryService.js
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export const fetchCategories = async () => {
  const categoriesCol = collection(db, 'categories')
  const snapshot = await getDocs(categoriesCol)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
