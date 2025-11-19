const validator = require('validator');

// Generate random short code
function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL
function isValidUrl(url) {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
}

// Validate code format
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

module.exports = {
  generateShortCode,
  isValidUrl,
  isValidCode
};