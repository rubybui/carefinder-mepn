const ApiKey = require('../models/ApiKey');

// Middleware to validate API key and set role level
const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // Get API key from header

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  try {
    const key = await ApiKey.findOne({ apikey: apiKey });
    if (!key) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    // Attach role level to the request object
    req.roleLevel = key.level;
    next();
  } catch (err) {
    console.error('Error validating API key:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to check if user is an Admin
const isAdmin = (req, res, next) => {
  if (req.roleLevel !== 1) {
    return res.status(403).json({ error: 'Access denied. Administrator only.' });
  }
  next();
};

module.exports = { validateApiKey, isAdmin };
