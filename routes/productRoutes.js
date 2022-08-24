const express = require('express');
const Admin = require('../models/admin');
const { protectRoute } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const {
  getAllProducts,
  createAProduct,
  updateProduct,
  deleteProduct,
  getAProduct,
} = require('../controllers/productController');

const productRouter = express.Router();

productRouter.use('/:productId/reviews', reviewRouter);

productRouter
  .route('/')
  .get(getAllProducts)
  .post(protectRoute(Admin), createAProduct);

productRouter
  .route('/:id')
  .get(getAProduct)
  .patch(protectRoute(Admin), updateProduct)
  .delete(protectRoute(Admin), deleteProduct);

module.exports = productRouter;
