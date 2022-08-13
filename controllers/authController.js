const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.protectRoute = (Model) =>
  catchAsync(async (req, res, next) => {
    // Check user is logged in
    console.log('aaaaa');
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    )
      next(
        new AppError('You are not logged in, please login and try again', 401)
      );
    // Get token and check if user is still exist
    const token = req.headers.authorization.split(' ')[1];

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    const user = await Model.findById(decoded.id);
    if (!user)
      next(
        new AppError('The user belong to this token is no longer exist', 401)
      );

    // All thing is ok -> send user to next process
    req.user = user;
    next();
  });
