const catchAsync = require('../utils/catchAsync');
const signToken = require('../utils/signToken');
const AppError = require('../utils/AppError');

const cookiesOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_TIME_EXPIRES * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

  // Set cookies
  res.cookie('jwt', token, cookiesOptions);

  // delete password before send to response
  user.password = undefined;
  // 200 for login success, 201 for create success
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

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
      next(new AppError('Please provide your username and password', 404));
    // check username is exist or wrong password
    const user = await Model.findOne({ username }).select('+password');
    if (!user || !user.isCorrectPassword(password, user.password))
      next(
        new AppError(
          'Username or password is incorrect, please check again!',
          404
        )
      );
    // All things is ok -> send back data
    createSendToken(user, 200, res);
  });
