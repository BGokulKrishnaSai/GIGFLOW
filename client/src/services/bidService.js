import api from './api'

const bidService = {
  createBid: async (bidData) => {
    try {
      const response = await api.post('/api/bids', bidData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create bid' }
    }
  },

  // ✅ FIXED: Changed backticks to parentheses
  getBidsForGig: async (gigId) => {
    try {
      const response = await api.get(`/bids/gig/${gigId}`)  // Was: api.get`...`
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bids' }
    }
  },

  getUserBids: async () => {
    try {
      const response = await api.get('/api/bids/user/my-bids')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your bids' }
    }
  },

  // ✅ FIXED: Changed backticks to parentheses
  hireBid: async (bidId) => {
    try {
      const response = await api.patch(`/bids/${bidId}/hire`)  // Was: api.patch`...`
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to hire bid' }
    }
  },

  // ✅ FIXED: Changed backticks to parentheses
  rejectBid: async (bidId, reason) => {
    try {
      const response = await api.patch(`/bids/${bidId}/reject`, { reason })  // Was: api.patch`...`
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reject bid' }
    }
  },

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
