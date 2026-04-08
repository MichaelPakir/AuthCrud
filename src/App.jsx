import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoutes from './components/ProtectedRoutes'
import MyRecipes from './pages/MyRecipes'
import Favorites from './pages/Favorites'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
