const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  apiKey: { type: String },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  provider: { type: String, default: 'manual' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
