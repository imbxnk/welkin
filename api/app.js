const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');


// Setting up config variables
dotenv.config({path: './config/.env'});

// Connect to MongoDB
connectDatabase();

// Importing all routes
const students = require('./routes/students');

app.use('/v1', students);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});