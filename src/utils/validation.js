export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function validateZipCode(zip) {
  const re = /^\d{5}(-\d{4})?$/
  return re.test(zip)
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}

