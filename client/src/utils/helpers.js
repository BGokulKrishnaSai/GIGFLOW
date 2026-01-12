// Check if user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem('user')
  return !!user
}

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('user')
}

// Check if user is gig owner
export const isGigOwner = (gigOwnerId, currentUserId) => {
  return gigOwnerId === currentUserId
}

// Check if user already bid on gig
export const hasUserBidOnGig = (bids, gigId) => {
  return bids.some((bid) => bid.gigId?._id === gigId)
}

// Filter gigs by search query
export const searchGigs = (gigs, searchQuery) => {
  if (!searchQuery.trim()) return gigs

  const query = searchQuery.toLowerCase()
  return gigs.filter((gig) =>
    gig.title.toLowerCase().includes(query) ||
    gig.description.toLowerCase().includes(query) ||
    gig.category.toLowerCase().includes(query) ||
    gig.skills?.some((skill) => skill.toLowerCase().includes(query))
  )
}

// Filter gigs by category
export const filterByCategory = (gigs, category) => {
  if (category === 'all') return gigs
  return gigs.filter((gig) => gig.category === category)
}

// Filter gigs by budget range
export const filterByBudget = (gigs, maxBudget) => {
  if (maxBudget === 'all') return gigs
  const max = Number(maxBudget)
  return gigs.filter((gig) => gig.budget <= max)
}

// Filter gigs by status
export const filterByStatus = (gigs, status) => {
  if (status === 'all') return gigs
  return gigs.filter((gig) => gig.status === status)
}

// Sort gigs
export const sortGigs = (gigs, sortBy) => {
  const sorted = [...gigs]

  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'highest-budget':
      return sorted.sort((a, b) => b.budget - a.budget)
    case 'lowest-budget':
      return sorted.sort((a, b) => a.budget - b.budget)
    default:
      return sorted
  }
}

// Get gig stats
export const getGigStats = (gigs) => {
  return {
    total: gigs.length,
    open: gigs.filter((g) => g.status === 'open').length,
    assigned: gigs.filter((g) => g.status === 'assigned').length,
    avgBudget: gigs.length > 0 ? Math.round(gigs.reduce((sum, g) => sum + g.budget, 0) / gigs.length) : 0,
    totalBudget: gigs.reduce((sum, g) => sum + g.budget, 0),
  }
}

// Get bid stats
export const getBidStats = (bids) => {
  return {
    total: bids.length,
    pending: bids.filter((b) => b.status === 'pending').length,
    hired: bids.filter((b) => b.status === 'hired').length,
    rejected: bids.filter((b) => b.status === 'rejected').length,
    successRate: bids.length > 0 ? Math.round((bids.filter((b) => b.status === 'hired').length / bids.length) * 100) : 0,
  }
}

// Get user level badge
export const getUserLevelBadge = (stats) => {
  const { total, successRate } = stats

  if (total >= 50 && successRate >= 80) return { level: 'Expert', color: 'gold' }
  if (total >= 20 && successRate >= 70) return { level: 'Intermediate', color: 'silver' }
  if (total >= 5 && successRate >= 60) return { level: 'Emerging', color: 'bronze' }
  return { level: 'Beginner', color: 'gray' }
}

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let lastRun = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastRun >= limit) {
      func(...args)
      lastRun = now
    }
  }
}

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// Get query parameter from URL
export const getQueryParam = (param) => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(param)
}

// Set query parameter in URL
export const setQueryParam = (param, value) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(param, value)
  window.history.replaceState({}, '', `?${searchParams.toString()}`)
}

// Local storage helpers
export const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },

  get: (key) => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },

  remove: (key) => {
    localStorage.removeItem(key)
  },

  clear: () => {
    localStorage.clear()
  },
}

// Export all helpers as object
export const helpers = {
  isAuthenticated,
  getCurrentUser,
  clearAuthData,
  isGigOwner,
  hasUserBidOnGig,
  searchGigs,
  filterByCategory,
  filterByBudget,
  filterByStatus,
  sortGigs,
  getGigStats,
  getBidStats,
  getUserLevelBadge,
  debounce,
  throttle,
  deepClone,
  getQueryParam,
  setQueryParam,
  storage,
}
