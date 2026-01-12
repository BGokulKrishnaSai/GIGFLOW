import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchGigs, fetchMyGigs, deleteGig, updateGig } from '../redux/slices/gigsSlice'
import { getBidsForGig, hireBid, rejectBid } from '../redux/slices/bidsSlice'
import { motion, AnimatePresence } from 'framer-motion'

export default function MyGigs() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { gigs, loading } = useSelector((state) => state.gigs)
  const { gigBids } = useSelector((state) => state.bids)
  const { user } = useSelector((state) => state.auth)
  const [expandedGig, setExpandedGig] = useState(null)
  const [editingGig, setEditingGig] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [hiringBidId, setHiringBidId] = useState(null)
  const [rejectingBidId, setRejectingBidId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    dispatch(fetchMyGigs())
  }, [dispatch])

  const myGigs = gigs.filter((gig) => {
    const owner = gig.ownerId?._id || gig.ownerId
    const uid = user?._id || user?.id
    if (!owner || !uid) return false
    return owner.toString() === uid.toString()
  })

  // Debug: log server data and user id to diagnose missing gigs
  console.debug('MyGigs Debug - state.gigs:', gigs)
  console.debug('MyGigs Debug - user:', user)
  console.debug('MyGigs Debug - myGigs:', myGigs)

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      dispatch(deleteGig(id))
    }
  }

  const handleViewBids = (gigId) => {
    if (expandedGig === gigId) {
      setExpandedGig(null)
    } else {
      dispatch(getBidsForGig(gigId))
      setExpandedGig(gigId)
    }
  }

  const handleHireBid = async (bidId, gigId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? This will reject other bids and assign the gig.')) return

    setHiringBidId(bidId)
    try {
      await dispatch(hireBid(bidId)).unwrap()
      // refresh gigs and bids for the gig
      dispatch(fetchMyGigs())
      dispatch(getBidsForGig(gigId))
      alert('Freelancer hired successfully!')
    } catch (err) {
      alert('Failed to hire freelancer: ' + err)
    } finally {
      setHiringBidId(null)
    }
  }

  const startRejecting = (bidId) => {
    setRejectingBidId(bidId)
    setRejectReason('')
  }

  const cancelReject = () => {
    setRejectingBidId(null)
    setRejectReason('')
  }

  const submitReject = async (bidId, gigId) => {
    setHiringBidId(bidId)
    try {
      await dispatch(rejectBid({ bidId, reason: rejectReason })).unwrap()
      dispatch(fetchMyGigs())
      dispatch(getBidsForGig(gigId))
    } catch (err) {
      alert('Failed to reject bid: ' + err)
    } finally {
      setHiringBidId(null)
      cancelReject()
    }
  }

  const handleEditClick = (gig) => {
    setEditingGig(gig._id)
    setEditForm({
      title: gig.title,
      description: gig.description,
      budget: gig.budget,
      category: gig.category,
      skills: gig.skills?.join(', ') || '',
    })
  }

  const handleEditSubmit = (gigId) => {
    const updateData = {
      ...editForm,
      budget: Number(editForm.budget),
      skills: editForm.skills.split(',').map((s) => s.trim()).filter((s) => s),
    }
    dispatch(updateGig({ id: gigId, data: updateData }))
    setEditingGig(null)
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <motion.h1
              className="text-2xl sm:text-3xl font-bold text-gray-900"
              whileHover={{ scale: 1.05 }}
            >
              My Gigs
            </motion.h1>
            <p className="text-gray-600 mt-1 text-sm">{myGigs.length} gig(s) posted</p>
          </div>
          <motion.button
            onClick={() => navigate('/post-gig')}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 font-semibold transition shadow-md text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
          >
            + Post New Gig
          </motion.button>
        </motion.div>

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
            <p className="text-gray-600 mt-4">Loading your gigs...</p>
          </motion.div>
        ) : myGigs.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white rounded-xl shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </motion.svg>
            <motion.p
              className="text-xl text-gray-600 mt-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              You haven't posted any gigs yet
            </motion.p>
            <motion.button
              onClick={() => navigate('/post-gig')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Post Your First Gig
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 sm:gap-6"
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
            <AnimatePresence>
              {myGigs.map((gig, index) => (
                <motion.div
                  key={gig._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition border-l-4 border-blue-600 overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -2 }}
                  layout
                >
                  <AnimatePresence mode="wait">
                    {editingGig === gig._id ? (
                      <motion.div
                        className="p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.h3
                          className="text-2xl font-bold mb-4"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          Edit Gig
                        </motion.h3>
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <motion.input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="Title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                          <motion.textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Description"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                          <motion.div
                            className="grid grid-cols-2 gap-4"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <motion.input
                              type="number"
                              value={editForm.budget}
                              onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                              placeholder="Budget"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                            <motion.select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <option value="General">General</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Mobile App">Mobile App</option>
                              <option value="Design">Design</option>
                              <option value="Writing">Writing</option>
                            </motion.select>
                          </motion.div>
                          <motion.input
                            type="text"
                            value={editForm.skills}
                            onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                            placeholder="Skills (comma-separated)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                          <motion.div
                            className="flex gap-2 pt-4"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <motion.button
                              onClick={() => handleEditSubmit(gig._id)}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold transition"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Save Changes
                            </motion.button>
                            <motion.button
                              onClick={() => setEditingGig(null)}
                              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 font-semibold transition"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Cancel
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="p-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <motion.h3
                                className="text-2xl font-bold text-gray-900 mb-2"
                                whileHover={{ scale: 1.02 }}
                              >
                                {gig.title}
                              </motion.h3>
                              <p className="text-gray-600 mb-3">{gig.description}</p>
                              <motion.div
                                className="flex flex-wrap gap-2 mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                {gig.skills?.map((skill, idx) => (
                                  <motion.span
                                    key={idx}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                    whileHover={{ scale: 1.1, backgroundColor: "#3B82F6", color: "#FFFFFF" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                              </motion.div>
                            </div>
                            <motion.div
                              className="text-right"
                              whileHover={{ scale: 1.05 }}
                            >
                              <span className="text-3xl font-bold text-blue-600">₹{gig.budget}</span>
                              <p className="text-gray-600 text-sm mt-1">
                                {gig.status === 'open' ? '🟢 Open' : '🔴 Assigned'}
                              </p>
                            </motion.div>
                          </div>

                          <motion.div
                            className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <p className="text-gray-600 text-sm">Category</p>
                              <p className="font-semibold text-gray-900">{gig.category}</p>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <p className="text-gray-600 text-sm">Status</p>
                              <p className="font-semibold text-gray-900 capitalize">{gig.status}</p>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <p className="text-gray-600 text-sm">Posted</p>
                              <p className="font-semibold text-gray-900">{new Date(gig.createdAt).toLocaleDateString()}</p>
                            </motion.div>
                          </motion.div>

                          <motion.div
                            className="flex gap-3 mt-6"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <motion.button
                              onClick={() => handleViewBids(gig._id)}
                              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold transition"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              📊 View Bids {expandedGig === gig._id && '✓'}
                            </motion.button>
                            <motion.button
                              onClick={() => handleEditClick(gig)}
                              className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 font-semibold transition"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              ✏️ Edit
                            </motion.button>
                            {gig.status === 'assigned' ? (
                              <motion.button
                                onClick={() => navigate(`/chat/${gig._id}`)}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                💬 Chat
                              </motion.button>
                            ) : (
                              <motion.button
                                onClick={() => handleDelete(gig._id)}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold transition"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                🗑️ Delete
                              </motion.button>
                            )}
                          </motion.div>
                        </motion.div>

                        <AnimatePresence>
                          {expandedGig === gig._id && (
                            <motion.div
                              className="border-t border-gray-200 p-6 bg-gray-50"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.h4
                                className="text-xl font-bold text-gray-900 mb-4"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                Bids ({gigBids.length})
                              </motion.h4>
                              {gigBids.length === 0 ? (
                                <motion.p
                                  className="text-gray-600"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                  No bids yet for this gig
                                </motion.p>
                              ) : (
                                <motion.div
                                  className="space-y-4"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                  {gigBids.map((bid, bidIndex) => (
                                    <motion.div
                                      key={bid._id}
                                      className="bg-white p-4 rounded-lg border border-gray-200"
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: bidIndex * 0.1 }}
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-semibold text-gray-900">{bid.freelancerId?.name}</h5>
                                        <motion.span
                                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            bid.status === 'hired' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                          }`}
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                          {bid.status}
                                        </motion.span>
                                      </div>
                                      <p className="text-gray-600 mb-2">{bid.message}</p>
                                      <p className="text-blue-600 font-semibold">💰 Bid: ₹{bid.bidAmount}</p>
                                      <div className="flex flex-col gap-2">
                                        {bid.status === 'pending' && (
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => handleHireBid(bid._id, gig._id)}
                                              disabled={hiringBidId === bid._id || rejectingBidId === bid._id}
                                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50"
                                            >
                                              {hiringBidId === bid._id ? 'Hiring...' : 'Hire'}
                                            </button>
                                            {!rejectingBidId && (
                                              <button
                                                onClick={() => startRejecting(bid._id)}
                                                disabled={hiringBidId === bid._id}
                                                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 font-semibold text-sm disabled:opacity-50"
                                              >
                                                Reject
                                              </button>
                                            )}
                                          </div>
                                        )}

                                        {rejectingBidId === bid._id && (
                                          <div className="mt-2 w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for rejection</label>
                                            <textarea
                                              value={rejectReason}
                                              onChange={(e) => setRejectReason(e.target.value)}
                                              rows={3}
                                              placeholder="Optional — provide a brief reason to help the freelancer improve"
                                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                            />
                                            <div className="mt-2 flex gap-2">
                                              <button
                                                onClick={() => submitReject(bid._id, gig._id)}
                                                disabled={hiringBidId === bid._id}
                                                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 font-semibold text-sm disabled:opacity-50"
                                              >
                                                {hiringBidId === bid._id ? 'Processing...' : 'Submit Rejection'}
                                              </button>
                                              <button
                                                onClick={cancelReject}
                                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        )}

                                        {bid.status === 'rejected' && bid.rejectionReason && (
                                          <p className="text-sm text-red-600 mt-2">Rejection reason: {bid.rejectionReason}</p>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
