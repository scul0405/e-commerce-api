const express = require('express');
const User = require('../models/user');
const {
  updateUser,
  deleteUser,
  changePassword,
} = require('../controllers/userController');
const protectRoute = require('../utils/ProtectRoute');

const userRouter = express.Router();

userRouter.use(protectRoute(User));

userRouter.route('/updateMe').patch(updateUser);
userRouter.route('/deleteMe').delete(deleteUser);
userRouter.route('/changePassword').patch(changePassword);

module.exports = userRouter;
