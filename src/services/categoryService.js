import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { categories as staticCategories } from '../services/categories'

export const fetchCategories = async () => {
  try {
    const categoriesCol = collection(db, 'categories')
    const snapshot = await getDocs(categoriesCol)

    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => {
        const staticCat = staticCategories.find((c) => c.id === doc.id)
        return {
          ...staticCat,
          ...doc.data(),
          id: doc.id,
        }
      })
    }
  } catch (error) {
    console.log('Firestore fetch failed, using static categories')
    console.error(error)
  }

  return staticCategories
}

export {
  getCategoryById,
  getCategoryIcon,
  getCategoryColor,
} from '../services/categories'
