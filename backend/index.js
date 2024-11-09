const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/authroutes');
const bookRoute = require('./routes/bookroutes');
const bodyParser = require('body-parser');
const path = require('path');
require('./db');
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Ensure this matches your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/books', bookRoute);
app.use('/api/auth', authRoute);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
