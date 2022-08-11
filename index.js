const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const mongoose = require('mongoose');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const server = express();
const port = process.env.PORT || 3000;

// SET SECURITY HTTP HEADER
server.use(helmet());

// Data sanitization against noSQL query injection
server.use(mongoSanitize());

// Data sanitization against XSS
server.use(xss());

// Prevent parameters pollution
server.use(
  hpp({
    whitelist: [],
  })
);

// RATE LIMIT
const limiter = rateLimit({
  max: process.env.MAX_RATE_LIMIT,
  windowMs: process.env.MAX_RATE_LIMIT_TIME * 60 * 1000, // unit: minutes
  message: `Too many requests from this IP, please try again after ${process.env.MAX_RATE_LIMIT_TIME} minutes !`,
});

server.use('/api', limiter);

// CORS
server.use(cors());

// Morgan
if (process.env.NODE_ENV === 'development') server.use(morgan('dev'));

server.use(express.json());

// Handle when no match any routes
server.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

// Execute all errors throw out global
server.use(globalErrorHandler);

// Database connection
const DB_URI = process.env.MONGODB_URI.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connect to database successful !');
  });

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
