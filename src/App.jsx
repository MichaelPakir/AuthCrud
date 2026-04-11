import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoutes from './components/ProtectedRoutes'
import MyRecipes from './pages/MyRecipes'
import Favorites from './pages/Favorites'
import CategoryPage from './pages/CategoryPage'
import RecipeDetail from './pages/RecipeDetail'
import AddRecipe from './components/AddRecipe'
import EditRecipe from './pages/EditRecipe'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        // public pages
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        // protected pages
        <Route element={<ProtectedRoutes />}>
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit/:id" element={<EditRecipe />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
