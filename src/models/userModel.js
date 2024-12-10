const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  role: {
    type: String,
    enum: ['user', 'admin'],  
    default: 'user'
  },
  apiKey: { type: String },
  password: { type: String },  
  googleId: { type: String, unique: true }, 
  provider: { type: String, default: 'mannual' },  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
