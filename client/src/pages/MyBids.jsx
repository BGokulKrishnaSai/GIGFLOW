import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserBids } from '../redux/slices/bidsSlice'
import { motion } from 'framer-motion'

export default function MyBids() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bids, loading } = useSelector((state) => state.bids)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    dispatch(getUserBids())
  }, [dispatch])

  // Robust filter: handle status as string or object, case-insensitive
  const filteredBids = filterStatus === 'all'
    ? bids
    : bids.filter((bid) => {
        if (!bid.status) return false;
        return String(bid.status).toLowerCase() === String(filterStatus).toLowerCase();
      });

  // DEBUG: log bids & filtering to help diagnose missing list items
  useEffect(() => {
    console.groupCollapsed('MyBids Debug')
    console.log('filterStatus:', filterStatus)
    console.log('bids:', bids)
    console.log('filteredBids:', filteredBids)
    console.groupEnd()
  }, [bids, filterStatus, filteredBids])

  const stats = {
    total: bids.length,
    pending: bids.filter((b) => b.status === 'pending').length,
    hired: bids.filter((b) => b.status === 'hired').length,
    rejected: bids.filter((b) => b.status === 'rejected').length,
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
          className="mb-6 sm:mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
            whileHover={{ scale: 1.05 }}
          >
            My Bids
          </motion.h1>
          <p className="text-gray-600 text-sm">Track and manage all your bids</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8"
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
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-gray-600 text-sm font-medium">Total Bids</p>
            <motion.p
              className="text-3xl font-bold text-blue-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
            >
              {stats.total}
            </motion.p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <motion.p
              className="text-3xl font-bold text-yellow-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}
            >
              {stats.pending}
            </motion.p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-gray-600 text-sm font-medium">Hired</p>
            <motion.p
              className="text-3xl font-bold text-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}
            >
              {stats.hired}
            </motion.p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-gray-600 text-sm font-medium">Rejected</p>
            <motion.p
              className="text-3xl font-bold text-red-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.5 }}
            >
              {stats.rejected}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="bg-white rounded-xl shadow-lg mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex border-b border-gray-200">
            {['all', 'pending', 'hired', 'rejected'].map((status, index) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 py-4 px-4 text-center font-semibold transition ${
                  filterStatus === status
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bids List */}
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
            <p className="text-gray-600 mt-4">Loading your bids...</p>
          </motion.div>
        ) : filteredBids.length === 0 ? (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>
            <motion.p
              className="text-xl text-gray-600 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {filterStatus === 'all' ? 'No bids yet' : `No ${filterStatus} bids`}
            </motion.p>
            <motion.button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Browse Gigs
            </motion.button>
          </motion.div>
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
            {filteredBids.map((bid, index) => (
              <motion.div
                key={bid._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <motion.h3
                      className="text-2xl font-bold text-gray-900 mb-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {bid.gigId?.title}
                    </motion.h3>
                    <p className="text-gray-600">Gig Budget: ₹{bid.gigId?.budget}</p>
                  </div>
                  <motion.span
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ml-4 ${
                      bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      bid.status === 'hired' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 + index * 0.1 }}
                  >
                    {bid.status === 'pending' ? '⏳ Pending' :
                     bid.status === 'hired' ? '✓ Hired' :
                     '✗ Rejected'}
                  </motion.span>
                </div>

                <motion.div
                  className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="text-gray-600 text-sm font-medium mb-2">Your Bid Message:</p>
                  <p className="text-gray-800">{bid.message}</p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <p className="text-gray-600 text-sm">Your Bid</p>
                    <p className="text-xl font-bold text-blue-600">₹{bid.bidAmount}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{bid.status}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <p className="text-gray-600 text-sm">Bid Date</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(bid.createdAt).toLocaleDateString()}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <p className="text-gray-600 text-sm">Gig Posted</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(bid.gigId?.createdAt).toLocaleDateString()}</p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex gap-3 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <motion.button
                    onClick={() => navigate(`/gig/${bid.gigId?._id}`)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Gig
                  </motion.button>
                  {bid.status === 'hired' && (
                    <motion.div
                      className="flex-1 bg-green-50 border border-green-300 rounded-lg py-2 text-center font-semibold text-green-700"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.6 + index * 0.1 }}
                    >
                      🎉 You're hired!
                    </motion.div>
                  )}
                  {bid.status === 'rejected' && (
                    <motion.div
                      className="flex-1 bg-red-50 border border-red-300 rounded-lg py-2 text-center font-semibold text-red-700"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.6 + index * 0.1 }}
                    >
                      Bid not selected
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
