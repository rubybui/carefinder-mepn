require('dotenv').config();
const mongoose = require('mongoose');
const { Types } = mongoose;
const fs = require('fs');
const ApiKey = require('../src/models/ApiKey');
const Hospital = require('../src/models/Hospital');
const User = require('../src/models/User');

// MongoDB connection using Mongoose
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB Connected');
        seedDatabase(); // Call seed function after connection is successful
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


function convertObjectIds(data) {
    return data.map((item) => {
        if (item._id && item._id.$oid) {
            item._id = new Types.ObjectId(item._id.$oid);
        }
        return item;
    });
}

// Seed database function
async function seedDatabase() {
    try {
        // Read JSON files
        const apikeysData = convertObjectIds(JSON.parse(fs.readFileSync('./databases/carefinder.apikeys.json', 'utf8')));
        const hospitalsData = convertObjectIds(JSON.parse(fs.readFileSync('./databases/carefinder.hospitals.json', 'utf8')));
        const usersData = convertObjectIds(JSON.parse(fs.readFileSync('./databases/carefinder.users.json', 'utf8')));

        // Insert API keys
        for (const apikey of apikeysData) {
            const existingApiKey = await ApiKey.findOne({ _id: apikey._id });
            if (!existingApiKey) {
                await ApiKey.create(apikey);
                console.log(`Inserted API key: ${apikey._id}`);
            } else {
                console.log(`API key already exists: ${apikey._id}`);
            }
        }

        // Insert users
        for (const user of usersData) {
            const existingUser = await User.findOne({ _id: user._id });
            if (!existingUser) {
                await User.create(user);
                console.log(`Inserted user: ${user._id}`);
            } else {
                console.log(`User already exists: ${user._id}`);
            }
        }


        // Insert hospitals
        for (const hospital of hospitalsData) {
            const existingHospital = await Hospital.findOne({ provider_id: hospital.provider_id });
            if (!existingHospital) {
              await Hospital.create(hospital);
              console.log(`Inserted hospital: ${hospital.provider_id}`);
            } else {
              console.log(`Hospital already exists with provider_id: ${hospital.provider_id}`);
            }
          }


        console.log('Database seeding completed');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close(() => {
            console.log('MongoDB Disconnected');
        });
    }
}
