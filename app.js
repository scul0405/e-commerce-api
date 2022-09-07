const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();
// SET SECURITY HTTP HEADER
app.use(helmet());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameters pollution
app.use(
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

app.use('/api', limiter);

// CORS
app.use(cors());

// Morgan
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

// ROUTE
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);

// Handle when no match any routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

// Execute all errors throw out global
app.use(globalErrorHandler);

module.exports = app;
