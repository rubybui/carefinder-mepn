const mongoose = require('mongoose');

// Define the schema for the phone number and location objects
const PhoneNumberSchema = new mongoose.Schema({
    _phone_number: String
});

const LocationSchema = new mongoose.Schema({
    _human_address: String,  // Storing this as a JSON string
    _latitude: String,
    _longitude: String,
    _needs_recoding: Boolean
});

// Define the main hospital schema
const HospitalSchema = new mongoose.Schema({
    provider_id: String,
    hospital_name: String,
    address: String,
    city: String,
    state: String,
    zip_code: String,
    county_name: String,
    phone_number: PhoneNumberSchema,
    hospital_type: String,
    hospital_ownership: String,
    emergency_services: Boolean,
    location: LocationSchema,
    __id: String,
    __uuid: String,
    __position: String,
    __address: String
});

module.exports = mongoose.model('Hospital', HospitalSchema);
