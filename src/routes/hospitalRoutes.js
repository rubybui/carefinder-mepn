const express = require('express');
const Hospital = require('../models/Hospital');
const { validateApiKey, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply API key validation to all routes
router.use(validateApiKey);

// Helper function to build query object
const buildQuery = (queryParams) => {
    const query = {};
    if (queryParams.providerid) query.provider_id = queryParams.providerid;
    if (queryParams.city) query.city = queryParams.city;
    if (queryParams.state) query.state = queryParams.state;
    if (queryParams.county) query.county_name = queryParams.county;
    if (queryParams.name) query.hospital_name = queryParams.name;
    if (queryParams.type) query.hospital_type = queryParams.type;
    if (queryParams.ownership) query.hospital_ownership = queryParams.ownership;
    if (queryParams.emergency) query.emergency_services = queryParams.emergency; 
    return query;
};

// GET /hospitals - List all hospitals or filter by query parameters
router.get('/', async (req, res) => {
    try {
      const query = buildQuery(req.query); // Build the query dynamically
      console.log("Generated Query:", query); // Log the query for debugging
  
      const hospitals = await Hospital.find(query); // Execute query in MongoDB
      console.log("Query Result:", hospitals); // Log the query results
  
      if (hospitals.length === 0) {
        return res.status(404).json({ error: 'No hospitals found matching the criteria' });
      }
      res.status(200).json(hospitals); // Return results
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// POST /hospitals - Add a new hospital (Admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        console.log("query", query)
        const hospital = new Hospital(req.body);
        console.log("hospitals", hospital)
        await hospital.save();
        res.status(201).json(hospital);
    } catch (err) {
        console.error('Error creating hospital:', err.errors);
        res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
});

// PUT /hospitals?providerid={number} - Update/Create a hospital resource (Admin Only)
router.put('/', isAdmin, async (req, res) => {
    const providerId = req.query.providerid;
    console.log("query", req.query)

    if (!providerId) {
        return res.status(400).json({ error: 'Provider ID is required for updating or creating a hospital' });
    }
    try {
        const updatedHospital = await Hospital.findOneAndUpdate(
            { provider_id: providerId },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(updatedHospital ? 200 : 201).json(updatedHospital);
    } catch (err) {
        console.error('Error updating/creating hospital:', err.errors);
        res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
});

// DELETE /hospitals - Delete all hospitals or filter by query parameters (Admin Only)
router.delete('/', isAdmin, async (req, res) => {
    try {
        const query = buildQuery(req.query);
        const result = await Hospital.deleteMany(query);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No hospitals found to delete' });
        }
        res.status(200).json({ message: `${result.deletedCount} hospital(s) deleted` });
    } catch (err) {
        console.error('Error deleting hospitals:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Haversine formula to calculate distance between two latitude/longitude points
// https://www.movable-type.co.uk/scripts/latlong.html
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (angle) => angle * Math.PI / 180;
    const R = 6371; // Earth's radius in kilometers

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
};

// GET /hospitals?lat={latitude}&lon={longitude}&dist={distance}
// Find hospitals within a given radius
router.get('/radius', async (req, res) => {
    const { lat, lon, dist } = req.query;

    if (!lat || !lon || !dist) {
        return res.status(400).json({ error: 'Latitude, longitude, and distance are required.' });
    }

    try {
        // Fetch all hospitals
        const hospitals = await Hospital.find();

        // Filter hospitals within the given radius
        const nearbyHospitals = hospitals.filter(hospital => {
            const hospitalLat = parseFloat(hospital.location._latitude);
            const hospitalLon = parseFloat(hospital.location._longitude);

            const distance = haversineDistance(
                parseFloat(lat),
                parseFloat(lon),
                hospitalLat,
                hospitalLon
            );

            return distance <= parseFloat(dist); // Check if within radius
        });

        if (nearbyHospitals.length === 0) {
            return res.status(404).json({ error: 'No hospitals found within the given distance.' });
        }

        res.status(200).json(nearbyHospitals); // Return nearby hospitals
    } catch (err) {
        console.error('Error fetching hospitals within radius:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /hospitals?lat={latitude}&lon={longitude}&dist={distance}
// Delete hospitals within a given radius (Admin Only)
router.delete('/radius', isAdmin, async (req, res) => {
    const { lat, lon, dist } = req.query;

    if (!lat || !lon || !dist) {
        return res.status(400).json({ error: 'Latitude, longitude, and distance are required.' });
    }

    try {
        // Fetch all hospitals
        const hospitals = await Hospital.find();

        // Filter hospitals within the given radius
        const hospitalsToDelete = hospitals.filter(hospital => {
            const hospitalLat = parseFloat(hospital.location._latitude);
            const hospitalLon = parseFloat(hospital.location._longitude);

            const distance = haversineDistance(
                parseFloat(lat),
                parseFloat(lon),
                hospitalLat,
                hospitalLon
            );

            return distance <= parseFloat(dist); // Check if within radius
        });

        if (hospitalsToDelete.length === 0) {
            return res.status(404).json({ error: 'No hospitals found to delete within the given distance.' });
        }

        const idsToDelete = hospitalsToDelete.map(hospital => hospital._id); // Collect IDs
        const result = await Hospital.deleteMany({ _id: { $in: idsToDelete } });

        res.status(200).json({ message: `${result.deletedCount} hospital(s) deleted` });
    } catch (err) {
        console.error('Error deleting hospitals within radius:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
