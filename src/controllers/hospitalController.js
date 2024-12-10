const Hospital = require('../models/hospitalModel');

exports.getAllHospitals = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const skip = (page - 1) * limit; // Calculate the number of records to skip

        // Fetch hospitals with pagination
        const hospitals = await Hospital.find()
            .skip(skip)
            .limit(limit);

        // Get total number of hospitals for pagination info
        const total = await Hospital.countDocuments();

        // If no hospitals are found, return an empty array
        if (hospitals.length === 0) {
            return res.status(200).json({
                hospitals: [],
                message: 'No hospitals found',
                currentPage: page,
                totalPages: 0,
                totalHospitals: 0
            });
        }

        // Return hospitals and pagination details
        res.status(200).json({
            hospitals,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalHospitals: total
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

// Create a new hospital (Admin only)
exports.createHospital = async (req, res) => {
    try {
        const hospital = new Hospital(req.body);
        await hospital.save();
        res.status(201).json(hospital);
    } catch (err) {
        res.status(400).json({ message: 'Bad request' });
    }
};

// Delete all hospitals (Admin only)
exports.deleteAllHospitals = async (req, res) => {
    try {
        await Hospital.deleteMany();
        res.status(200).json({ message: 'All hospitals deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Bad request' });
    }
};

// Get hospital by providerid
exports.getHospitalById = async (req, res) => {
    try {
        const providerId = req.params.providerId; // Get providerId from the URL
        const hospital = await Hospital.findOne({ provider_id: providerId }); // Assuming `provider_id` is the field in the DB

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.status(200).json(hospital);
    } catch (err) {
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

// Update/Create hospital by providerid (Admin only)
exports.updateHospitalById = async (req, res) => {
    try {
        const providerId = req.params.providerId; // Get providerId from the URL
        const updatedHospital = await Hospital.findOneAndUpdate(
            { provider_id: providerId }, // Find hospital by providerId
            req.body,                    // Update hospital data from request body
            { new: true, runValidators: true } // Return updated document, validate data
        );

        if (!updatedHospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.status(200).json(updatedHospital);
    } catch (err) {
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

// Delete hospital by providerid (Admin only)
exports.deleteHospitalById = async (req, res) => {
    try {
        const providerId = req.params.providerId; // Get providerId from the URL
        const result = await Hospital.deleteOne({ provider_id: providerId }); // Delete hospital by providerId

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.status(200).json({ message: 'Hospital deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

// Get hospitals by city
exports.getHospitalsByCity = async (req, res) => {
    console.log("Received city:", req.query.city);
    console.log("Received page:", req.query.page, "Received limit:", req.query.limit);

    try {
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const skip = (page - 1) * limit; // Calculate the number of records to skip
        const city = req.query.city.trim(); // Make sure city is passed

        // Fetch hospitals with pagination and case-insensitive city search
        const hospitals = await Hospital.find({ city: { $regex: new RegExp(city, "i") } })
            .skip(skip)
            .limit(limit);

        // Get total number of hospitals for pagination info (matching city)
        const total = await Hospital.countDocuments({ city: { $regex: new RegExp(city, "i") } });

        // If no hospitals are found, return an empty array
        if (hospitals.length === 0) {
            return res.status(200).json({
                hospitals: [],
                message: 'No hospitals found',
                currentPage: page,
                totalPages: 0,
                totalHospitals: 0
            });
        }

        // Return hospitals and pagination details
        res.status(200).json({
            hospitals,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalHospitals: total
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

// Get hospitals by state
exports.getHospitalsByState = async (req, res) => {
    console.log("Received states:", req.query.state);
    console.log("Received page:", req.query.page, "Received limit:", req.query.limit);

    try {
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const skip = (page - 1) * limit; // Calculate the number of records to skip
        const state = req.query.state.trim(); // Make sure city is passed

        // Fetch hospitals with pagination and case-insensitive city search
        const hospitals = await Hospital.find({ state: { $regex: new RegExp(state, "i") } })
            .skip(skip)
            .limit(limit);

        // Get total number of hospitals for pagination info (matching city)
        const total = await Hospital.countDocuments({ state: { $regex: new RegExp(state, "i") } });

        // If no hospitals are found, return an empty array
        if (hospitals.length === 0) {
            return res.status(200).json({
                hospitals: [],
                message: 'No hospitals found',
                currentPage: page,
                totalPages: 0,
                totalHospitals: 0
            });
        }

        // Return hospitals and pagination details
        res.status(200).json({
            hospitals,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalHospitals: total
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

exports.getHospitalsByCounty = async (req, res) => {
    console.log("Received states:", req.query.county);
    console.log("Received page:", req.query.page, "Received limit:", req.query.limit);

    try {
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const skip = (page - 1) * limit; // Calculate the number of records to skip
        const county = req.query.county.trim(); // Make sure city is passed

        // Fetch hospitals with pagination and case-insensitive city search
        const hospitals = await Hospital.find({ county: { $regex: new RegExp(county, "i") } })
            .skip(skip)
            .limit(limit);

        // Get total number of hospitals for pagination info (matching city)
        const total = await Hospital.countDocuments({ county: { $regex: new RegExp(county, "i") } });

        // If no hospitals are found, return an empty array
        if (hospitals.length === 0) {
            return res.status(200).json({
                hospitals: [],
                message: 'No hospitals found',
                currentPage: page,
                totalPages: 0,
                totalHospitals: 0
            });
        }

        // Return hospitals and pagination details
        res.status(200).json({
            hospitals,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalHospitals: total
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(400).json({ message: 'Bad request', error: err });
    }
};

// Controller for deleting hospitals by city
exports.deleteHospitalsByCity = async (req, res) => {

    try {
        const city = req.query.city.trim();;
        console.log('City Query:', city); // Log city query parameter
        if (!city) {
            return res.status(400).json({ message: 'City query parameter is required' });
        }
        const result = await Hospital.deleteMany({ city: { $regex: new RegExp(city, "i") } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `No hospitals found to delete in city: ${city}` });
        }
        res.status(200).json({ message: `Successfully deleted hospitals in city: ${city}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};