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

// Setup body parser
app.use(express.json());

// Setup cookie parser
// const cookieParser = require('cookie-parser');
// app.use(cookieParser);

// Importing all routes
const students = require('./routes/students');
const auth = require('./routes/auth');
const user = require('./routes/user');
app.use('/v1', students);
app.use('/v1', auth);
app.use('/v1', user);

// Show "Not Found" if route does not exist
app.all('*', function(req, res){
    res.setHeader('content-type', 'text/plain');
    res.status(404).send('Not Found');
});

// Error Handler
const errorMiddleware = require('./middlewares/errors');
app.use(errorMiddleware);

// Start listening to PORT
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection.`);
    server.close( () => {
        process.exit(1);
    });
})