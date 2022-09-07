const express = require('express');

const {
  createAUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

const authRouter = express.Router();

authRouter.route('/signup').post(createAUser);
authRouter.route('/login').post(loginUser);
authRouter.route('/forgotPassword').post(forgotPassword);
authRouter.route('/resetPassword/:resetToken').post(resetPassword);

module.exports = authRouter;
