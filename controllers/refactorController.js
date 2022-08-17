const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const createSendToken = require('../utils/createSendToken');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    createSendToken(doc, 201, res);
  });

exports.loginOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // check name and password is provided
    const { username, password } = req.body;
    if (!username || !password)
      return next(
        new AppError('Please provide your username and password', 404)
      );
    // check username is exist or wrong password
    const user = await Model.findOne({ username }).select('+password');
    if (!user || !(await user.isCorrectPassword(password, user.password)))
      return next(
        new AppError(
          'Username or password is incorrect, please check again!',
          404
        )
      );
    // All things is ok -> send back data
    createSendToken(user, 200, res);
  });
