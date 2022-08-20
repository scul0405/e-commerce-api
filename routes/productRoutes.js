const express = require('express');
const Admin = require('../models/admin');
const { protectRoute } = require('../controllers/authController');
const {
  getAllProducts,
  createAProduct,
} = require('../controllers/productController');

const productRouter = express.Router();

productRouter
  .route('/')
  .get(getAllProducts)
  .post(protectRoute(Admin), createAProduct);

module.exports = productRouter;
