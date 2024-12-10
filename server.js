const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser'); // Add this
const authRoutes = require('./src/routes/authRoutes');
const apiKeyRoutes = require('./src/routes/apiKeyRoutes');
const hospitalRoutes = require('./src/routes/hospitalRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Enable cookie parsing
app.set('view engine', 'pug');
app.use((req, res, next) => {
  console.log(`HTTP Method: ${req.method}, URL: ${req.url}`);
  next();
});

app.use(methodOverride('_method'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/apikeys', apiKeyRoutes);
app.use('/hospitals', hospitalRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Node.js server');
});

// Start the server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port: ${server.address().port}`);
});
