const express = require('express');
const app = express();

// Setting up config variables
const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

// Connect to MongoDB
const connectDatabase = require('./config/database');
connectDatabase();

// Setup body parser
app.use(express.json());

// Importing all routes
const students = require('./routes/students');
app.use('/v1', students);

// Show "Not Found" if route does not exist
app.get('*', function(req, res){
    res.setHeader('content-type', 'text/plain');
    res.status(404).send('Not Found');
});

// Start listening to PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});