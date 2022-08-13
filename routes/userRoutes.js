const express = require('express');
const User = require('../models/user');
const {
  createAUser,
  loginUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protectRoute } = require('../controllers/authController');

const userRouter = express.Router();

userRouter.route('/signup').post(createAUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/updateMe').patch(protectRoute(User), updateUser);
userRouter.route('/deleteMe').delete(protectRoute(User), deleteUser);

module.exports = userRouter;
