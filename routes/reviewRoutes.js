const express = require('express');
const User = require('../models/user');
const { protectRoute } = require('../controllers/authController');
const {
  getAllReviews,
  getAReview,
  createAReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(protectRoute(User), createAReview);

reviewRouter
  .route('/:id')
  .get(getAReview)
  .patch(protectRoute(User), updateReview)
  .delete(protectRoute(User), deleteReview);

module.exports = reviewRouter;
