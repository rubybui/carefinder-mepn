const APIKey = require('../models/apiKeyModel');
const apikeygen = require('apikeygen').apikey;

// Create a new API key
exports.createKey = async (req, res) => {
  try {
    const { username, level } = req.body;
    const apikey = apikeygen();

    const newAPIKey = new APIKey({
      username,
      apikey,
      level,
    });

    await newAPIKey.save();
    res.status(201).json({ message: 'API Key created successfully', data: newAPIKey });
  } catch (error) {
    res.status(500).json({ message: 'Error creating API key', error });
  }
};

// Get an API key by key
exports.getKey = async (req, res) => {
  try {
    const { key } = req.params;
    const apiKey = await APIKey.findOne({ apikey: key });

    if (!apiKey) {
      return res.status(404).json({ message: 'No API Key found with the provided key' });
    }

    res.status(200).json({ data: apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching API key', error });
  }
};

// Delete all API keys (Admin only)
exports.deleteAllKeys = async (req, res) => {
  try {
    await APIKey.deleteMany();
    res.status(200).json({ message: 'All API keys deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting API keys', error });
  }
};

// Delete a specific API key by key
exports.deleteKey = async (req, res) => {
  try {
    const { key } = req.params;
    const apiKey = await APIKey.findOneAndDelete({ apikey: key });

    if (!apiKey) {
      return res.status(404).json({ message: 'No API Key found to delete with the provided key' });
    }

    res.status(200).json({ message: 'API Key deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting API key', error });
  }
};
