const express = require('express');
const ApiKey = require('../models/ApiKey');
const cookieParser = require('cookie-parser'); // For parsing cookies
const { generateApiKey } = require('generate-api-key');
const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

// List API keys
router.get('/', (req, res) => {
  const currentUser = req.cookies?.currentUser ? JSON.parse(req.cookies.currentUser) : null;

  if (!currentUser) {
    console.log('No currentUser found in cookies. Redirecting to login.');
    return res.redirect('/auth/login');
  }

  // Determine the query based on the user's role
  const query = currentUser.role === 'admin' 
    ? {} // Admins see all API keys
    : { username: currentUser.username }; // Non-admins see only their own keys

  ApiKey.find(query)
    .then((keys) => {
      const userLevel = currentUser.role === 'admin' ? 1 : 2;
      res.render('apikeys', { keys, user: { ...currentUser, level: userLevel } });
    })
    .catch((err) => {
      console.error('Error fetching API keys:', err);
      res.status(500).send('Error fetching API keys.');
    });
});

// Create API key
router.post('/', async (req, res) => {
  const currentUser = req.cookies?.currentUser ? JSON.parse(req.cookies.currentUser) : null;

  if (!currentUser) {
    console.log('No currentUser found in cookies. Redirecting to login.');
    return res.redirect('/auth/login');
  }

  try {
     const apikey = generateApiKey({
      method: 'string', // Method to generate the key. Options: 'string', 'bytes', 'base32', 'base62', 'uuidv4', 'uuidv5'
      length: 32,       // Length of the generated key
      prefix: currentUser.username // Optional prefix (e.g., username)
    });
    const newKey = new ApiKey({
      username: currentUser.username,
      apikey,
      level: currentUser.role === 'admin' ? 1 : 2,
    });
    await newKey.save();
    res.redirect('/apikeys');
  } catch (err) {
    console.error('Error creating API key:', err);
    res.status(400).send('Failed to create API key.');
  }
});

// Delete API key
router.delete('/:id', async (req, res) => {
  const currentUser = req.cookies?.currentUser ? JSON.parse(req.cookies.currentUser) : null;

  if (!currentUser) {
    console.log('No currentUser found in cookies. Redirecting to login.');
    return res.redirect('/auth/login');
  }

  try {
    const { id } = req.params;
    await ApiKey.findByIdAndDelete(id);
    console.log(`API Key ${id} deleted successfully`);
    res.redirect('/apikeys'); // Redirect to /apikeys after deletion
  } catch (err) {
    console.error('Error deleting API key:', err);
    res.status(500).send('Error deleting API key.');
  }
});

module.exports = router;
