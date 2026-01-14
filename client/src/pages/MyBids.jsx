import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserBids } from '../redux/slices/bidsSlice'
import { motion } from 'framer-motion'

export default function MyBids() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bids, loading, error } = useSelector((state) => state.bids)  // ADD error
  const [filterStatus, setFilterStatus] = useState('all')
  const [backendError, setBackendError] = useState('')

  useEffect(() => {
    // Add error handler
    dispatch(getUserBids())
      .unwrap()
      .catch((err) => {
        console.error('getUserBids failed:', err)
        setBackendError(`Backend error: ${err.message || err}`)
      })
  }, [dispatch])

  // Backend status check
  useEffect(() => {
    console.log('🔧 Redux bids state:', { bids: bids.length, loading, error, backendError })
  }, [bids, loading, error, backendError])

  const filteredBids = filterStatus === 'all'
    ? bids
    : bids.filter((bid) => String(bid.status).toLowerCase() === filterStatus.toLowerCase())

  const stats = {
    total: bids.length,
    pending: bids.filter((b) => b.status === 'pending').length,
    hired: bids.filter((b) => b.status === 'hired').length,
    rejected: bids.filter((b) => b.status === 'rejected').length,
  }

  // Show backend issues clearly
  if (backendError || error) {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Backend Connection Issue</h2>
            <p className="text-red-700 mb-4">
              {backendError || error || 'Unable to fetch bids. Backend may be down.'}
            </p>
            <div className="space-x-3">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold"
              >
                Retry
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-semibold"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Rest of your JSX stays EXACTLY the same */}
      <div className="max-w-6xl mx-auto">
        {/* ... your existing stats cards, filter tabs, bids list ... */}
        {loading ? (
          <motion.div className="text-center py-16">
            <motion.div className="inline-block rounded-full h-12 w-12 border-b-2 border-blue-600 animate-spin" />
            <p className="text-gray-600 mt-4">Loading your bids...</p>
          </motion.div>
        ) : filteredBids.length === 0 ? (
          <motion.div className="text-center py-16 bg-white rounded-xl shadow-xl">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600 mt-4">
              {filterStatus === 'all' ? 'No bids yet' : `No ${filterStatus} bids`}
            </p>
            <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Browse Gigs
            </button>
          </motion.div>
        ) : (
          // Your existing bids list JSX
          filteredBids.map((bid, index) => (
            <motion.div key={bid._id} className="bg-white rounded-xl shadow-lg p-6">
              {/* Your existing bid card JSX */}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
