const crypto = require('crypto');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');
const createSendToken = require('../utils/createSendToken');

const { createOne, loginOne } = require('./refactorController');

exports.createAUser = createOne(User);
exports.loginUser = loginOne(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('This route is not for change password', 500));
  const user = await User.findByIdAndUpdate(req.user._id, req.body);
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user)
    return next(
      new AppError('username does not exist, please check and try again', 404)
    );
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // prevent provide confirmPassword error
  await sendEmail(
    user.email,
    'Your password reset token',
    `Forgot your password? Follow this link to change your password: ${
      req.protocol
    }://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}. If you didn't forget, please ignore this email!`
  );
  res.status(200).json({
    status: 'success',
    data: {
      resetToken,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // check user is exist ?
  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
  // if exist -> set new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select('+password');
  if (!(await user.isCorrectPassword(req.body.password, user.password)))
    return next(new AppError('Your password is not correct !', 400));
  if (!req.body.newPassword || !req.body.confirmNewPassword)
    return next(
      new AppError('Please provide new password and confirm new password', 400)
    );
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();
  res.status(200).json({
    status: 'success',
  });
});
