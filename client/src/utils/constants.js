// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  GIGS: {
    GET_ALL: '/gigs',
    GET_ONE: (id) => `/gigs/${id}`,
    CREATE: '/gigs',
    UPDATE: (id) => `/gigs/${id}`,
    DELETE: (id) => `/gigs/${id}`,
  },
  BIDS: {
    CREATE: '/bids',
    GET_FOR_GIG: (gigId) => `/bids/gig/${gigId}`,
    GET_USER_BIDS: '/bids/user/my-bids',
    HIRE: (bidId) => `/bids/${bidId}/hire`,
    REJECT: (bidId) => `/bids/${bidId}/reject`,
  },
}

// Status values
export const STATUS = {
  GIG: {
    OPEN: 'open',
    ASSIGNED: 'assigned',
  },
  BID: {
    PENDING: 'pending',
    HIRED: 'hired',
    REJECTED: 'rejected',
  },
}

// Categories
export const CATEGORIES = [
  'General',
  'Web Development',
  'Mobile App',
  'Design',
  'Writing',
  'Marketing',
  'Video Production',
  'Other',
]

// Budget ranges
export const BUDGET_RANGES = [
  { value: 'all', label: 'All Budgets' },
  { value: '500', label: '< ₹500' },
  { value: '1000', label: '< ₹1,000' },
  { value: '5000', label: '< ₹5,000' },
  { value: '10000', label: '< ₹10,000' },
]

// Skills list
export const COMMON_SKILLS = [
  'React',
  'Node.js',
  'MongoDB',
  'JavaScript',
  'Python',
  'Django',
  'Vue.js',
  'Angular',
  'TypeScript',
  'GraphQL',
  'REST API',
  'AWS',
  'Docker',
  'Git',
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'HTML/CSS',
  'Database Design',
  'SEO',
  'Content Writing',
  'Copywriting',
  'Email Marketing',
  'Social Media',
  'Video Editing',
  'Photoshop',
  'Illustration',
]

// Error messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_NAME: 'Name must be between 2 and 50 characters',
  INVALID_TITLE: 'Title must be between 5 and 100 characters',
  INVALID_DESCRIPTION: 'Description must be between 20 and 5000 characters',
  INVALID_BUDGET: 'Budget must be a valid amount',
  INVALID_BID_AMOUNT: 'Bid amount must be greater than 0',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
}

// Success messages
export const SUCCESS_MESSAGES = {
  GIG_CREATED: 'Gig created successfully!',
  GIG_UPDATED: 'Gig updated successfully!',
  GIG_DELETED: 'Gig deleted successfully!',
  BID_CREATED: 'Bid submitted successfully!',
  BID_HIRED: 'Freelancer hired successfully!',
  BID_REJECTED: 'Bid rejected successfully!',
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  REGISTER_SUCCESS: 'Account created successfully!',
}

// Validation rules
export const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 5000,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 6,
  MIN_BUDGET: 1,
  MAX_BUDGET: 10000000,
}

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
  PREFERENCES: 'preferences',
  CACHE_GIGS: 'cache_gigs',
  CACHE_BIDS: 'cache_bids',
}

// Sort options
export const SORT_OPTIONS = [
  { value: 'latest', label: '📅 Latest First' },
  { value: 'oldest', label: '📅 Oldest First' },
  { value: 'highest-budget', label: '💰 Highest Budget' },
  { value: 'lowest-budget', label: '💰 Lowest Budget' },
]

// Filter options
export const FILTER_OPTIONS = {
  CATEGORY: [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ],
  STATUS: [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
  ],
  BID_STATUS: [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ],
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50],
}

// Time limits (in milliseconds)
export const TIME_LIMITS = {
  DEBOUNCE_SEARCH: 500,
  THROTTLE_SCROLL: 1000,
  API_TIMEOUT: 30000,
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// Export all constants
export const constants = {
  API_ENDPOINTS,
  STATUS,
  CATEGORIES,
  BUDGET_RANGES,
  COMMON_SKILLS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  STORAGE_KEYS,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  PAGINATION,
  TIME_LIMITS,
}
