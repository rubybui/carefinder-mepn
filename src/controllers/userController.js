const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const apikeygen = require('apikeygen').apikey;

const generateApiKey = () => {
    return apikeygen();
};
exports.showSignup = (req, res) => {
    res.render('signup');
};

// Show Signin Form
exports.showSignin = (req, res) => {
    res.render('signin');
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = generateApiKey();

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            apiKey,
            provider: 'manual',
        });

        await newUser.save();

        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            level: newUser.role,
        };
        res.status(201).json({ message: 'User registered successfully', apiKey });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message || error });
    }
};

exports.signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            level: user.role,
        };

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error });
    }
};

exports.googleAuthCallback = async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            username: profile.displayName,
            googleId: profile.id,
            apiKey: generateApiKey(),
            provider: 'google',
        });

        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, false);
    }
};

// Handle Signout
exports.signOutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error signing out' });
        }
        res.json({ message: 'Signout successful' });
    });
};