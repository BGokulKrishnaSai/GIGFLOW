import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import NotificationCenter from './components/NotificationCenter'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostGig from './pages/PostGig'
import MyGigs from './pages/MyGigs'
import GigDetail from './pages/GigDetail'
import MyBids from './pages/MyBids'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <NotificationCenter />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/gig/:id" element={<GigDetail />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/post-gig" element={<PostGig />} />
            <Route path="/my-gigs" element={<MyGigs />} />
            <Route path="/my-bids" element={<MyBids />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default App
