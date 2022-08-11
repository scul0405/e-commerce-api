const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/admin');
const signToken = require('../utils/signToken');

exports.createAnAdminUser = catchAsync(async (req, res, next) => {
  const newAdminUser = await Admin.create({
    username: req.body.username,
    password: req.body.password,
  });
  console.log(newAdminUser._id);
  const token = signToken(newAdminUser._id);
  console.log(token);
  res.status(201).json({
    status: 'success',
    token,
  });
});
