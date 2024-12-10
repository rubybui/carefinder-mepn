const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  username: { type: String, required: true },
  apikey: { type: String, required: true, unique: true },
  level: { type: Number, required: true }, // 1 = Admin, 2 = User
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
