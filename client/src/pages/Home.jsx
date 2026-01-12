import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchGigs } from '../redux/slices/gigsSlice'
import GigCard from '../components/GigCard'
import { motion } from 'framer-motion'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { gigs = [], loading = false } = useSelector((state) => state.gigs || {}) // ✅ Safe destructuring
  const { isAuthenticated } = useSelector((state) => state.auth || {})
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    budget: 'all',
  })

  useEffect(() => {
    dispatch(fetchGigs(searchQuery))
  }, [dispatch, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
  }

  // ✅ FIXED: Safe filtering with null checks
  const filteredGigs = (gigs || []).filter((gig) => {
    if (filters.category !== 'all' && gig.category !== filters.category) return false
    if (filters.budget !== 'all') {
      const budgetLimits = { '500': 500, '1000': 1000, '5000': 5000, '10000': 10000 }
      if (gig.budget > budgetLimits[filters.budget]) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Find your <span className="text-yellow-300">perfect gig</span> today
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Thousands of freelance opportunities are waiting for you.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-lg shadow-lg">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search gigs by title, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold whitespace-nowrap transition shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                <div className="space-y-3">
                  {['all', 'Web Development', 'Mobile App', 'Design', 'Writing', 'Other'].map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer hover:text-blue-600">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="mr-3 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-700 capitalize">{cat === 'all' ? 'All Categories' : cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                <div className="space-y-3">
                  {['all', '500', '1000', '5000', '10000'].map((budget) => (
                    <label key={budget} className="flex items-center cursor-pointer hover:text-blue-600">
                      <input
                        type="radio"
                        name="budget"
                        value={budget}
                        checked={filters.budget === budget}
                        onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                        className="mr-3 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-700">
                        {budget === 'all' ? 'All' : `< ₹${budget}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📧 Newsletter</h3>
                <p className="text-gray-600 text-sm mb-3">Get latest gigs in your inbox</p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Gigs List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredGigs.length} Gig{filteredGigs.length !== 1 ? 's' : ''} Found
              </h2>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/post-gig')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Post a Gig
                </button>
              )}
            </div>

            {loading ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="inline-block rounded-full h-12 w-12 border-b-2 border-blue-600"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <p className="text-gray-600 mt-4">Loading gigs...</p>
              </motion.div>
            ) : filteredGigs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-xl text-gray-600 mt-4 mb-4">No gigs found</p>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                {isAuthenticated && (
                  <button
                    onClick={() => navigate('/post-gig')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Post a Gig
                  </button>
                )}
              </div>
            ) : (
              <motion.div 
                className="grid gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {filteredGigs.map((gig, index) => (
                  <GigCard key={gig._id} gig={gig} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
