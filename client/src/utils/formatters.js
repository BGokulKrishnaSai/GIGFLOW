// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// Format date short
export const formatDateShort = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

// Format time ago (e.g., "2 hours ago")
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'

  return Math.floor(seconds) + ' seconds ago'
}

// Truncate text
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Capitalize first letter
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Format skills array to string
export const formatSkills = (skills) => {
  if (!Array.isArray(skills)) return ''
  return skills.join(', ')
}

// Parse skills string to array
export const parseSkills = (skillsString) => {
  if (!skillsString) return []
  return skillsString.split(',').map((skill) => skill.trim()).filter((skill) => skill.length > 0)
}

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

// Format percentage
export const formatPercentage = (value, total) => {
  if (total === 0) return '0%'
  return Math.round((value / total) * 100) + '%'
}

// Shorten user name
export const shortenName = (name) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0] + ' ' + parts[1].charAt(0) + '.'
  }
  return name
}
