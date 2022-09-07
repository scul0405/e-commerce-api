const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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
