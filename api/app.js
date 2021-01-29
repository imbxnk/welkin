const express = require('express');
const app = express();

// Setting up config variables
const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

/// Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception.`);
    process.exit(1);
});

// Connect to MongoDB
const connectDatabase = require('./config/database');
connectDatabase();

// Error Handler
const errorMiddleware = require('./middlewares/errors');

// Setup body parser
app.use(express.json());

// Importing all routes
const students = require('./routes/students');
app.use('/v1', students);

app.use(errorMiddleware);
// Show "Not Found" if route does not exist
app.all('*', function(req, res){
    res.setHeader('content-type', 'text/plain');
    res.status(404).send('Not Found');
});

// Start listening to PORT
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to handled promise rejection.`);
    server.close( () => {
        process.exit(1);
    });
})