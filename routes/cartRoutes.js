const express = require('express');
const User = require('../models/user');
const {
  updateQuantity,
  addToCart,
  getUserCart,
} = require('../controllers/cartController');
const { protectRoute } = require('../controllers/authController');

const cartRouter = express.Router({ mergeParams: true });

cartRouter.use(protectRoute(User));

cartRouter.route('/addToCart').patch(addToCart);
cartRouter.route('/updateQuantity').patch(updateQuantity);

cartRouter.route('/').get(getUserCart);
module.exports = cartRouter;
