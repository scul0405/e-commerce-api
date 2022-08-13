const express = require('express');
const {
  createAnAdminUser,
  loginAdminUser,
} = require('../controllers/adminController');

const adminRouter = express.Router();

adminRouter.route('/login').post(loginAdminUser);

adminRouter.route('/signup').post(createAnAdminUser);

module.exports = adminRouter;
