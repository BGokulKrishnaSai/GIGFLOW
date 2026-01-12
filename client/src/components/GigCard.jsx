import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function GigCard({ gig, index }) {
  const isOpen = gig.status === 'open'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/gig/${gig._id}`}>
        <motion.div
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border-l-4 border-blue-600 group overflow-hidden relative"
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          {/* Animated background gradient on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />

          {/* Header with Status */}
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <motion.h3
                className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2"
                whileHover={{ scale: 1.02 }}
              >
                {gig.title}
              </motion.h3>
              <p className="text-gray-600 text-sm">
                👤 <span className="font-medium">{gig.ownerId?.name || 'Unknown'}</span>
              </p>
            </div>
            <motion.span
              className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ml-4 ${
                isOpen
                  ? 'bg-green-100 text-green-800 shadow-sm'
                  : 'bg-red-100 text-red-800 shadow-sm'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {isOpen ? '🟢 Open' : '🔴 Assigned'}
            </motion.span>
          </div>

          {/* Description */}
          <p className="relative z-10 text-gray-700 mb-3 line-clamp-2 text-sm leading-relaxed">
            {gig.description}
          </p>

          {/* Skills */}
          {gig.skills && gig.skills.length > 0 && (
            <motion.div
              className="relative z-10 flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {gig.skills.slice(0, 3).map((skill, idx) => (
                <motion.span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                  whileHover={{ scale: 1.1, backgroundColor: "#3B82F6", color: "#FFFFFF" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {skill}
                </motion.span>
              ))}
              {gig.skills.length > 3 && (
                <motion.span
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold"
                  whileHover={{ scale: 1.1 }}
                >
                  +{gig.skills.length - 3}
                </motion.span>
              )}
            </motion.div>
          )}

          {/* Footer Stats */}
          <div className="relative z-10 flex justify-between items-end border-t pt-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 text-xs">Budget</p>
              <p className="text-2xl font-bold text-blue-600">₹{gig.budget.toLocaleString()}</p>
            </motion.div>
            <motion.div
              className="text-right"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 text-xs">Category</p>
              <p className="text-sm font-semibold text-gray-900">{gig.category}</p>
            </motion.div>
            <motion.div
              className="text-right"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 text-xs">Posted</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(gig.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </motion.div>
          </div>

          {/* Hover Indicator */}
          <motion.div
            className="relative z-10 mt-2 text-center text-blue-600 text-xs font-semibold"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Click to view details →
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
