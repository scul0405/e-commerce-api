const express = require('express');
const { createAnAdminUser } = require('../controllers/adminController');

const adminRouter = express.Router();

adminRouter.route('/').post(createAnAdminUser);

module.exports = adminRouter;
