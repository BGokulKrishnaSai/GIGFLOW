import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/')
    setShowMenu(false)
  }

  return (
    <motion.nav 
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-bold text-xl">G</span>
              </motion.div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GigFlow
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">
              🔍 Browse Gigs
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-gigs" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">
                  📋 My Gigs
                </Link>
                <Link to="/my-bids" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">
                  📊 My Bids
                </Link>
                <Link to="/post-gig" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300">
                  ➕ Post Gig
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800 font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium transition shadow-md"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="text-blue-600 px-6 py-2 font-semibold hover:text-blue-700 transition border border-blue-600 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden pb-4 space-y-2 border-t">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg">
              🔍 Browse Gigs
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-gigs" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg">
                  📋 My Gigs
                </Link>
                <Link to="/my-bids" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg">
                  📊 My Bids
                </Link>
                <Link to="/post-gig" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg">
                  ➕ Post Gig
                </Link>
              </>
            )}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
              >
                🚪 Logout
              </button>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  )
}
