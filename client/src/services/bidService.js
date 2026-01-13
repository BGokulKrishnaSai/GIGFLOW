import api from './api'

// Bid Service API endpoints
const bidService = {
  // Create a new bid
  createBid: async (bidData) => {
    try {
      const response = await api.post('/api/bids', bidData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create bid' }
    }
  },

  // Get all bids for a specific gig
  getBidsForGig: async (gigId) => {
    try {
      const response = await api.get(`/bids/gig/${gigId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bids' }
    }
  },

  // Get user's bids
  getUserBids: async () => {
    try {
      const response = await api.get('/api/bids/user/my-bids')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your bids' }
    }
  },

  // Hire a freelancer (accept a bid)
  hireBid: async (bidId) => {
    try {
      const response = await api.patch(`/bids/${bidId}/hire`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to hire bid' }
    }
  },

  // Reject a bid (optional reason)
  rejectBid: async (bidId, reason) => {
    try {
      const response = await api.patch(`/bids/${bidId}/reject`, { reason })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject bid' }
    }
  },

  // Get bid statistics
  getBidStats: async () => {
    try {
      const response = await api.get('/api/bids/user/my-bids')
      const bids = response.data.data || []
      return {
        total: bids.length,
        pending: bids.filter((b) => b.status === 'pending').length,
        hired: bids.filter((b) => b.status === 'hired').length,
        rejected: bids.filter((b) => b.status === 'rejected').length,
      }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bid stats' }
    }
  },
}

export default bidService
