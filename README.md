# RecipeHub - Full-Stack Recipe Management Application

A modern, full-stack web application for discovering, creating, and managing recipes with user authentication and real-time cloud image storage.

**Live Demo:** [Deployed on Vercel](https://greathall.vercel.app/)

## 🎯 Project Overview

RecipeHub is a React-based recipe management platform that demonstrates full-stack development capabilities. Users can browse recipes by category, create and manage their own recipes, upload images via Cloudinary, and maintain a personalized favorites list.

This project showcases production-grade practices including:

- Protected routes and authentication flows
- Component-based architecture with React Context
- Real-time image upload and optimization
- Responsive design with TailwindCSS
- Modern build tooling with Vite

## ✨ Key Features

### User Authentication

- Firebase authentication with email/password login
- Persistent session management
- Protected routes requiring authentication
- Secure logout functionality

### Recipe Management

- **Browse**: Explore recipes by category with infinite browsing
- **Create**: Add new recipes with titles, descriptions, ingredients, and instructions
- **Edit**: Modify existing recipes with optimized cloud uploads
- **Delete**: Remove unwanted recipes with confirmation flows
- **Search**: Filter recipes by category in real-time

### Media Handling

- Cloudinary integration for image uploads
- Automatic image optimization and compression
- Client-side validation before upload
- Error handling for upload failures

### Favorites System

- Toggle recipes as favorites with instant UI feedback
- Persistent favorites list per user
- Filter view to show only favorited recipes

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library with hooks
- **React Router v7** - Client-side routing with protected routes
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend & Services

- **Firebase** - Authentication and database
- **Cloudinary** - Image hosting and optimization

### Development Tools

- **ESLint** - Code quality and consistency
- **Node Package Manager** - Dependency management

## 📁 Project Architecture

```
src/
├── components/          # Reusable React components
│   ├── AddRecipe.jsx           # Recipe creation form (protected)
│   ├── RecipeCard.jsx          # Recipe display component
│   ├── FavoriteToggle.jsx      # Favorite button with state management
│   ├── ImageUploadTest.jsx     # Cloudinary image upload handler
│   ├── ProtectedRoutes.jsx     # Route guard for authenticated users
│   └── Header.jsx              # Navigation header
├── contexts/            # React Context for state management
│   ├── AuthContext.jsx         # User authentication state
│   └── ToggleFavContext.jsx    # Favorites state management
├── pages/               # Page-level components (routes)
│   ├── Home.jsx                # Recipe listing
│   ├── Login.jsx               # Authentication page
│   ├── CategoryPage.jsx        # Category-filtered recipes
│   ├── RecipeDetail.jsx        # Single recipe view
│   ├── EditRecipe.jsx          # Recipe editing
│   ├── MyRecipes.jsx           # User's recipes (protected)
│   └── Favorites.jsx           # User's favorites (protected)
├── layouts/             # Layout wrappers
│   └── MainLayout.jsx          # App-wide layout with header/footer
├── services/            # Business logic and API calls
│   ├── categories.js           # Category fetching
│   └── imageService.js         # Cloudinary integration
├── lib/
│   └── firebase.js             # Firebase configuration
└── App.jsx              # Root component with routing
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase project credentials
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AuthCrud
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file with your credentials:

   ```
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 📋 Available Scripts

```bash
npm run dev      # Start development server with HMR
npm run build    # Build for production (optimized output)
npm run lint     # Run ESLint to check code quality
npm run preview  # Preview production build locally
```

## 🏗️ Architecture Decisions

### Component Structure

- **Functional Components**: All components use modern React hooks for cleaner, more maintainable code
- **Context API**: Chosen over Redux for simplicity; state is lifted to context providers for authentication and favorites
- **Protected Routes**: Implemented via `ProtectedRoutes.jsx` component wrapper that checks authentication before rendering

### Image Management

- **Cloudinary Integration**: Handles image optimization, compression, and CDN delivery
- **Client-side Validation**: Validates file type and size before upload to improve UX
- **Error Handling**: Graceful fallbacks for failed uploads

### Authentication Flow

1. User logs in via Firebase Authentication
2. Auth state stored in `AuthContext`
3. `ProtectedRoutes` component checks auth state
4. Unauthenticated users redirected to login page
5. Session persists across page reloads via Firebase

### State Management

- **Local State**: Component-level state for form inputs and UI toggles
- **Context State**: Global state for authentication and favorites
- **Firebase**: Acts as the source of truth for data persistence

## 🎨 UI/UX Highlights

- **Responsive Design**: Mobile-first approach with TailwindCSS utilities
- **Icon System**: HeroIcons for consistent, accessible icons
- **Loading States**: User feedback during async operations
- **Error Handling**: User-friendly error messages
- **Optimized Images**: Cloudinary handles responsive image delivery

## 📊 Key Features Implementation

### Protected Routes

```jsx
// ProtectedRoutes checks if user is authenticated
// If not, redirects to /login
// Otherwise, renders protected pages
```

### Favorites Toggle

- Real-time UI updates via Context
- Persisted to Firebase database
- Instant visual feedback

### Image Uploads

- Cloudinary widget integration
- Client-side validation
- Error recovery

## 🔒 Security Considerations

- ✅ Firebase authentication for secure user sessions
- ✅ Protected routes prevent unauthorized access
- ✅ Environment variables keep sensitive data secure
- ✅ Client-side validation prevents malformed data submission
- ✅ Cloudinary handles secure image storage

## 🚀 Performance Optimizations

- **Vite**: Near-instant HMR and optimized production builds
- **Code Splitting**: Route-based code splitting for faster initial load
- **Image Optimization**: Cloudinary compression reduces bandwidth
- **TailwindCSS**: Utility-first CSS minimizes unused styles

## 📈 Future Enhancement Ideas

- [ ] Advanced search and filtering (cuisine type, difficulty, prep time)
- [ ] Recipe ratings and user reviews
- [ ] Social sharing functionality
- [ ] Meal planning and shopping list generation
- [ ] Recipe recommendations based on favorites
- [ ] Export recipes to PDF
- [ ] Dark mode toggle

## 🤝 Contributing

This is a portfolio project showcasing full-stack development skills. Feel free to explore the code structure and architecture decisions.

## 📝 License

This project is open source and available under the MIT License.

---

## About the Developer

This project demonstrates proficiency in:

- **Frontend Development**: React with modern hooks, Context API, React Router
- **State Management**: Context API for global state
- **Cloud Services Integration**: Firebase authentication and Cloudinary media management
- **UI/UX Design**: Responsive design with TailwindCSS and HeroIcons
- **Build Tools**: Vite for optimized development and production builds
- **Code Quality**: ESLint configuration for consistent code standards
