import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createGig } from '../redux/slices/gigsSlice'
import { motion } from 'framer-motion'

export default function PostGig() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'General',
    skills: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.gigs)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.description || !formData.budget) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.budget <= 0) {
      setError('Budget must be greater than 0')
      return
    }

    try {
      const gigData = {
        ...formData,
        budget: Number(formData.budget),
        skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s),
      }

      const result = await dispatch(createGig(gigData))
      if (result.payload) {
        setSuccess('Gig posted successfully!')
        setTimeout(() => {
          navigate('/my-gigs')
        }, 1500)
      }
    } catch {
      setError('Failed to post gig. Please try again.')
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Post a New Gig
            </motion.h1>
            <p className="text-gray-600">Tell freelancers about your project</p>
          </motion.div>

          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                🎉 {success}
              </motion.div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">Gig Title *</label>
              <motion.input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Build a React Dashboard"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <p className="text-gray-500 text-sm mt-1">Be specific and clear</p>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <motion.textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <p className="text-gray-500 text-sm mt-1">Include project requirements and expectations</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className="block text-gray-700 font-semibold mb-2">Budget (₹) *</label>
                <motion.input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  min="0"
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <motion.select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <option value="General">General</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Other">Other</option>
                </motion.select>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label className="block text-gray-700 font-semibold mb-2">Skills Required</label>
              <motion.input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <p className="text-gray-500 text-sm mt-1">Separate multiple skills with commas</p>
            </motion.div>

            <motion.div
              className="flex gap-4 pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Posting...' : 'Post Gig'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}
