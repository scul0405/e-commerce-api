const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const { createOne, loginOne } = require('./refactorController');

exports.createAUser = createOne(User);
exports.loginUser = loginOne(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword)
    next(new AppError('This route is not for change password', 500));
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
