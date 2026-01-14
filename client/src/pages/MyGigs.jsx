import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchGigs, fetchMyGigs, deleteGig, updateGig } from '../redux/slices/gigsSlice'
import { getBidsForGig, hireBid, rejectBid } from '../redux/slices/bidsSlice'
import { motion, AnimatePresence } from 'framer-motion'

export default function MyGigs() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { gigs, loading, error: gigsError } = useSelector((state) => state.gigs)  // ADD error
  const { gigBids, bidsLoading, bidsError } = useSelector((state) => state.bids)
  const { user, token, isAuthenticated } = useSelector((state) => state.auth)
  const [expandedGig, setExpandedGig] = useState(null)
  const [editingGig, setEditingGig] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [hiringBidId, setHiringBidId] = useState(null)
  const [rejectingBidId, setRejectingBidId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [backendError, setBackendError] = useState('')
  const [apiStatus, setApiStatus] = useState('idle')

  // Load gigs with error handling
  useEffect(() => {
    setApiStatus('loading')
    dispatch(fetchMyGigs())
      .unwrap()
      .catch((err) => {
        console.error('fetchMyGigs failed:', err)
        setBackendError(`Backend error: ${err.message || err.statusText || 'Unknown error'}`)
        setApiStatus('error')
      })
      .finally(() => setApiStatus('loaded'))
  }, [dispatch])

  // Filter my gigs with better error checking
  const myGigs = gigs.filter((gig) => {
    const owner = gig.ownerId?._id || gig.ownerId
    const uid = user?._id || user?.id
    if (!owner || !uid) {
      console.warn('Missing owner/user ID:', { owner, uid, gigId: gig._id })
      return false
    }
    return owner.toString() === uid.toString()
  })

  // DEBUG: Comprehensive logging
  useEffect(() => {
    console.group('🔧 MyGigs Debug')
    console.log('Redux state:', { 
      gigsCount: gigs.length, 
      myGigsCount: myGigs.length, 
      loading, 
      gigsError, 
      backendError,
      userId: user?._id,
      tokenExists: !!token,
      isAuthenticated 
    })
    console.log('First few gigs:', gigs.slice(0, 3))
    console.groupEnd()
  }, [gigs, myGigs, loading, backendError])

  // Backend error UI
  if (backendError || gigsError) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-8 shadow-xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-800 mb-4">Backend Connection Failed</h2>
            <p className="text-xl text-red-700 mb-6 max-w-md mx-auto leading-relaxed">
              {backendError || gigsError || 'Unable to load your gigs'}
            </p>
            <div className="space-x-4">
              <motion.button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                🔄 Retry Load
              </motion.button>
              <motion.button 
                onClick={() => navigate('/post-gig')} 
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                ➕ Post New Gig
              </motion.button>
            </div>
            <details className="mt-6 p-4 bg-red-100 rounded-lg text-sm text-red-800">
              <summary>Debug Info (click to expand)</summary>
              <pre>{JSON.stringify({ backendError, gigsError, gigsCount: gigs.length, myGigsCount: myGigs.length }, null, 2)}</pre>
            </details>
          </div>
        </div>
      </motion.div>
    )
  }

  // Loading state
  if (loading || apiStatus === 'loading') {
    return (
      <motion.div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
        <div className="text-center">
          <motion.div 
            className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Gigs</h2>
          <p className="text-gray-600">Fetching gigs from backend...</p>
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
      <div className="max-w-6xl mx-auto">
        <motion.h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          My Gigs ({myGigs.length})
        </motion.h1>
        
        {myGigs.length === 0 ? (
          <motion.div 
            className="text-center py-20 bg-white rounded-2xl shadow-2xl border-4 border-dashed border-gray-200"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Gigs Posted Yet</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Get started by posting your first gig and attract freelancers
            </p>
            <motion.button
              onClick={() => navigate('/post-gig')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              🚀 Post Your First Gig
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {myGigs.map((gig, index) => (
              <motion.div
                key={gig._id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Your existing gig card JSX here */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{gig.title}</h3>
                      <p className="text-3xl font-black text-blue-600">₹{gig.budget}</p>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                      {gig.status || 'Open'}
                    </span>
                  </div>
                  
                  {/* Expandable bids section, edit buttons, etc. - keep your existing JSX */}
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                    <p>{gig.description}</p>
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                    <button 
                      onClick={() => navigate(`/gig/${gig._id}`)}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => setEditingGig(gig._id)}
                      className="bg-gray-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-700"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => dispatch(deleteGig(gig._id))}
                      className="bg-red-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
