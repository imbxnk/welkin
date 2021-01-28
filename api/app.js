const express = require('express');
const app = express();

// Setting up config variables
const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

// Connect to MongoDB
const connectDatabase = require('./config/database');
connectDatabase();

// Importing all routes
const students = require('./routes/students');

app.use('/v1', students);

// Show "Not Found" if route does not exist
app.get('*', function(req, res){
    res.status(404).send('<pre style="word-wrap: break-word; white-space: pre-wrap;">Not Found</pre>');
});

// Start listening to PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});