// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

// Gig title validation
export const isValidGigTitle = (title) => {
  return title && title.trim().length >= 5 && title.trim().length <= 100
}

// Description validation
export const isValidDescription = (description) => {
  return description && description.trim().length >= 20 && description.trim().length <= 5000
}

// Budget validation
export const isValidBudget = (budget) => {
  const budgetNum = Number(budget)
  return budgetNum && budgetNum > 0 && budgetNum <= 10000000
}

// Bid amount validation
export const isValidBidAmount = (amount) => {
  const amountNum = Number(amount)
  return amountNum && amountNum > 0
}

// Skills validation
export const isValidSkills = (skills) => {
  if (!Array.isArray(skills)) return false
  return skills.length > 0 && skills.every((skill) => skill.trim().length > 0)
}

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50
}

// Message validation
export const isValidMessage = (message) => {
  return message && message.trim().length >= 10 && message.trim().length <= 1000
}

// Validate gig form data
export const validateGigForm = (formData) => {
  const errors = {}

  if (!isValidGigTitle(formData.title)) {
    errors.title = 'Title must be between 5 and 100 characters'
  }

  if (!isValidDescription(formData.description)) {
    errors.description = 'Description must be between 20 and 5000 characters'
  }

  if (!isValidBudget(formData.budget)) {
    errors.budget = 'Budget must be between 1 and 10,000,000'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate bid form data
export const validateBidForm = (formData) => {
  const errors = {}

  if (!isValidMessage(formData.message)) {
    errors.message = 'Message must be between 10 and 1000 characters'
  }

  if (!isValidBidAmount(formData.bidAmount)) {
    errors.bidAmount = 'Bid amount must be greater than 0'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate auth form
export const validateAuthForm = (formData, isLogin = false) => {
  const errors = {}

  if (!isLogin && !isValidName(formData.name)) {
    errors.name = 'Name must be between 2 and 50 characters'
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (!isLogin && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
