
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/signup', userController.showSignup);
router.get('/signin', userController.showSignin);

// Handle Signup and Signin
router.post('/signup', userController.registerUser);
router.post('/signin', userController.signInUser);
module.exports = router;