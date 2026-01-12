import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGigById } from '../redux/slices/gigsSlice'
import { createBid, getUserBids, getBidsForGig, hireBid } from '../redux/slices/bidsSlice'
import { isGigOwner as checkGigOwner } from '../utils/helpers'
import { motion } from 'framer-motion'

export default function GigDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentGig, loading } = useSelector((state) => state.gigs)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { bids: userBids, gigBids, loading: bidLoading } = useSelector((state) => state.bids)
  
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidForm, setBidForm] = useState({
    message: '',
    bidAmount: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hiringBidId, setHiringBidId] = useState(null)

  // Fetch gig once on mount (by id)
  useEffect(() => {
    dispatch(fetchGigById(id));
  }, [dispatch, id]);

  // Fetch user's bids when authenticated (only once when auth state changes)
  useEffect(() => {
    if (isAuthenticated) dispatch(getUserBids());
  }, [dispatch, isAuthenticated]);

  // When gig is loaded, if current user is owner fetch bids for the gig
  useEffect(() => {
    const ownerId = currentGig?.ownerId?._id || currentGig?.ownerId;
    const userId = user?._id || user?.id;
    if (isAuthenticated && ownerId && userId && checkGigOwner(ownerId.toString(), userId.toString())) {
      dispatch(getBidsForGig(id));
    }
  }, [dispatch, id, isAuthenticated, currentGig?.ownerId, user?._id, user?.id]);

  const alreadyBid = userBids.some((bid) => bid.gigId?._id === id)
  const ownerId = currentGig?.ownerId?._id || currentGig?.ownerId
  const userId = user?._id || user?.id
  const isGigOwner = ownerId && userId && checkGigOwner(ownerId.toString(), userId.toString())

  const handleBidChange = (e) => {
    setBidForm({
      ...bidForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleBidSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!bidForm.message || !bidForm.bidAmount) {
      setError('Please fill in all fields')
      return
    }

    if (bidForm.bidAmount <= 0) {
      setError('Bid amount must be greater than 0')
      return
    }

    try {
      const result = await dispatch(createBid({
        gigId: id,
        message: bidForm.message,
        bidAmount: Number(bidForm.bidAmount),
      }))

      if (result.payload) {
        setSuccess('Bid submitted successfully!')
        setBidForm({ message: '', bidAmount: '' })
        setShowBidForm(false)
        setTimeout(() => {
          dispatch(getUserBids())
        }, 500)
      } else {
        setError(result.payload || 'Failed to submit bid')
      }
    } catch {
      setError('Failed to submit bid. Please try again.')
    }
  }

  const handleHireBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? This will reject all other bids and assign the gig.')) {
      return
    }

    setHiringBidId(bidId)
    try {
      await dispatch(hireBid(bidId)).unwrap()
      // Refresh the gig data and bids
      dispatch(fetchGigById(id))
      dispatch(getBidsForGig(id))
      alert('Freelancer hired successfully! They will receive a notification.')
    } catch (error) {
      alert('Failed to hire freelancer: ' + error)
    } finally {
      setHiringBidId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading gig details...</p>
        </div>
      </div>
    )
  }

  if (!currentGig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Gig not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Gigs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-8 flex items-center"
        >
          ← Back to Gigs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-8">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentGig.title}</h1>
                    <p className="text-gray-600">Posted by {currentGig.ownerId?.name}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold text-lg ${
                    currentGig.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : currentGig.status === 'assigned'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentGig.status === 'open' ? '✓ Open' : currentGig.status === 'assigned' ? '✓ Assigned' : currentGig.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 sm:py-6 border-y border-gray-200">
                  <div>
                    <p className="text-gray-600 text-sm">Budget</p>
                    <p className="text-3xl font-bold text-blue-600">₹{currentGig.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Category</p>
                    <p className="text-lg font-semibold text-gray-900">{currentGig.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Posted Date</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(currentGig.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{currentGig.description}</p>
              </div>

              {currentGig.skills && currentGig.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {currentGig.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-base">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Client</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900 mb-2">{currentGig.ownerId?.name}</p>
                  <p className="text-gray-600 mt-2">Email: {currentGig.ownerId?.email}</p>
                  <p className="text-gray-600">Member since: {currentGig.ownerId?.createdAt ? new Date(currentGig.ownerId.createdAt).toLocaleDateString() : 'N/A'}</p>
                  {currentGig.status === 'assigned' && currentGig.assignedTo && (
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <p className="font-semibold">Hired: {currentGig.assignedTo.name}</p>
                      <p className="text-sm text-gray-600">{currentGig.assignedTo.email}</p>
                      <div className="mt-2">
                        <button onClick={() => window.location.href = `/chat/${currentGig._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">Chat with hired freelancer</button>
                      </div>
                    </div>
                  )}

                  {/* If current user is the assigned freelancer, show chat with client */}
                  {currentGig.status === 'assigned' && currentGig.assignedTo && user && (user._id === (currentGig.assignedTo._id || currentGig.assignedTo)) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="font-semibold">You have been hired for this gig!</p>
                      <div className="mt-2">
                        <button onClick={() => window.location.href = `/chat/${currentGig._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">Chat with Client</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {isGigOwner ? (
              <motion.div
                className="bg-white rounded-xl shadow-xl p-8 sticky top-20"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h3
                  className="text-xl font-bold text-gray-900 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  📋 Manage Your Gig
                </motion.h3>
                <p className="text-gray-600 mb-6">Review bids from freelancers</p>

                {gigBids && gigBids.length > 0 ? (
                  <motion.div
                    className="space-y-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h4 className="font-semibold text-gray-900">Bids Received ({gigBids.length})</h4>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {gigBids.map((bid, index) => (
                        <motion.div
                          key={bid._id}
                          className={`p-4 rounded-lg border-2 ${
                            bid.status === 'hired'
                              ? 'border-green-300 bg-green-50'
                              : bid.status === 'rejected'
                              ? 'border-red-300 bg-red-50'
                              : 'border-blue-300 bg-blue-50'
                          }`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{bid.freelancerId?.name}</p>
                              <p className="text-sm text-gray-600">{bid.freelancerId?.email}</p>
                            </div>
                            <motion.span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                bid.status === 'hired'
                                  ? 'bg-green-200 text-green-800'
                                  : bid.status === 'rejected'
                                  ? 'bg-red-200 text-red-800'
                                  : 'bg-yellow-200 text-yellow-800'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              {bid.status}
                            </motion.span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{bid.message}</p>
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-blue-600">₹{bid.bidAmount}</p>
                            {bid.status === 'pending' && currentGig.status === 'open' && (
                              <motion.button
                                onClick={() => handleHireBid(bid._id)}
                                disabled={hiringBidId === bid._id}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold transition disabled:opacity-50 text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                {hiringBidId === bid._id ? 'Hiring...' : 'Hire'}
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-8 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <p>No bids received yet</p>
                  </motion.div>
                )}

                <motion.button
                  onClick={() => navigate('/my-gigs')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Go to My Gigs
                </motion.button>
              </motion.div>
            ) : currentGig.status === 'assigned' ? (
              <motion.div
                className="bg-gray-50 rounded-xl shadow-xl p-8 sticky top-20 border-2 border-gray-300"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.p
                  className="text-lg font-bold text-gray-900"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  This gig has been assigned
                </motion.p>
                <p className="text-gray-600 mt-2">The freelancer has already been hired for this project.</p>
              </motion.div>
            ) : alreadyBid ? (
              <motion.div
                className="bg-green-50 rounded-xl shadow-xl p-8 sticky top-20 border-2 border-green-300"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h3
                  className="text-xl font-bold text-green-900 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  ✓ You've already bid on this gig
                </motion.h3>
                <p className="text-green-700 mb-4">Your bid is pending. The client will review and contact you soon.</p>
                <motion.button
                  onClick={() => navigate('/my-bids')}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  View My Bids
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white rounded-xl shadow-xl p-8 sticky top-20"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Submit Your Bid
                </motion.h3>

                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {success}
                  </motion.div>
                )}

                {!isAuthenticated ? (
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="text-gray-600 mb-4">You need to login to submit a bid</p>
                    <motion.button
                      onClick={() => navigate('/login')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition mb-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => navigate('/register')}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      Sign Up
                    </motion.button>
                  </motion.div>
                ) : !showBidForm ? (
                  <motion.button
                    onClick={() => setShowBidForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Submit Bid
                  </motion.button>
                ) : (
                  <motion.form
                    onSubmit={handleBidSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-2">Your Bid Message</label>
                      <motion.textarea
                        name="message"
                        value={bidForm.message}
                        onChange={handleBidChange}
                        placeholder="Tell the client why you're the right person for this job..."
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-2">Bid Amount (₹)</label>
                      <motion.input
                        type="number"
                        name="bidAmount"
                        value={bidForm.bidAmount}
                        onChange={handleBidChange}
                        placeholder="Enter your bid amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        min="0"
                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    </motion.div>

                    <motion.div
                      className="flex gap-2 pt-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={bidLoading}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {bidLoading ? 'Submitting...' : 'Submit Bid'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowBidForm(false)}
                        className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold transition"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
