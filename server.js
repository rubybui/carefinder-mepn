const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const hospitalRoutes = require('./src/routes/hospitalRoutes');
const userRoutes = require('./src/routes/userRoutes');
const apiKeyRoutes = require('./src/routes/apiKeyRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src/views'));

app.use(session({
    secret: process.env.SECRET_KEY, // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

  
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log(err));

app.use('/hospitals', hospitalRoutes);
app.use('/user', userRoutes);
app.use('/apikey', apiKeyRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`);
    next();
});
app.use((req, res) => {
  console.log('Request did not match any route');
  res.status(404).send('Route not found');
});