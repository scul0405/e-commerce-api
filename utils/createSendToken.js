const signToken = require('./signToken');

const cookiesOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_TIME_EXPIRES * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

module.exports = (user, statusCode, res) => {
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
