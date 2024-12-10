const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const cookieParser = require('cookie-parser'); // For parsing cookies

const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

// Signup route
router.get('/signup', (req, res) => res.render('signup', { error: null }));

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    // Store user in a cookie (serialize as JSON)
    res.cookie('currentUser', JSON.stringify(user), { httpOnly: true });
    console.log('User created and stored in cookie:', user);
    res.redirect('/apikeys');
  } catch (err) {
    console.error('Error during signup:', err);
    res.render('signup', { error: 'User already exists or invalid data.' });
  }
});

// Login route
router.get('/login', (req, res) => res.render('login', { error: null }));

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    // Store user in a cookie (serialize as JSON)
    res.cookie('currentUser', JSON.stringify(user), { httpOnly: true });
    console.log('User stored in cookie:', user);
    res.redirect('/apikeys');
  } catch (err) {
    console.error('Error during login:', err);
    res.render('login', { error: 'An error occurred during login.' });
  }
});

module.exports = router;
