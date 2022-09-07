const express = require('express');
const Admin = require('../models/admin');
const User = require('../models/user');
const protectRoute = require('../utils/ProtectRoute');
const {
  createAnOrder,
  getAnOrder,
  getAllOrders,
  handleOrder,
} = require('../controllers/orderController');

const orderRouter = express.Router({ mergeParams: true });

orderRouter
  .route('/')
  .post(protectRoute(User), createAnOrder)
  .get(protectRoute(Admin), getAllOrders);

orderRouter
  .route('/:id')
  .get(protectRoute(Admin), getAnOrder)
  .post(protectRoute(Admin), handleOrder);

module.exports = orderRouter;
