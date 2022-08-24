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
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const server = express();
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

server.use(cookieParser());
server.use(express.json());
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

// ROUTE
server.use('/api/v1/admin', adminRouter);
server.use('/api/v1/users', userRouter);
server.use('/api/v1/products', productRouter);
server.use('/api/v1/reviews', reviewRouter);

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

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
