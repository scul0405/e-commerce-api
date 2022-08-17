const express = require('express');
const User = require('../models/user');
const {
  createAUser,
  loginUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/userController');
const { protectRoute } = require('../controllers/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(createAUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/updateMe').patch(protectRoute(User), updateUser);
userRouter.route('/deleteMe').delete(protectRoute(User), deleteUser);
userRouter.route('/forgotPassword').post(forgotPassword);
userRouter.route('/resetPassword/:resetToken').post(resetPassword);
userRouter.route('/changePassword').patch(protectRoute(User), changePassword);

module.exports = userRouter;
