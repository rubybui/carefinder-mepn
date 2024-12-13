const mongoose = require('mongoose');

// Define the schema for the phone number and location objects
const PhoneNumberSchema = new mongoose.Schema({
  _phone_number: { type: String, required: true }
});

const LocationSchema = new mongoose.Schema({
  _human_address: { type: String, required: true }, // Store as JSON string
  _latitude: { type: Number, required: true }, // Use Number for latitude
  _longitude: { type: Number, required: true }, // Use Number for longitude
  _needs_recoding: { type: Boolean, default: false }
});

// Define the main hospital schema
const HospitalSchema = new mongoose.Schema({
  provider_id: { type: String, unique: true, required: true },
  hospital_name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
  county_name: { type: String, required: false },
  phone_number: { type: PhoneNumberSchema, required: true },
  hospital_type: { type: String, required: true },
  hospital_ownership: { type: String, required: true },
  emergency_services: { type: String, required: true, default: 'false' },
  location: { type: LocationSchema, required: true },
  __position: { type: String, required: false },
  __address: { type: String, required: true }
});

// Add indexes for performance optimization
HospitalSchema.index({ provider_id: 1 });
HospitalSchema.index({ __uuid: 1 });

module.exports = mongoose.model('Hospital', HospitalSchema);
