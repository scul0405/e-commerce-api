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

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.route('/').get(getAllReviews).post(createAReview);

reviewRouter
  .route('/:id')
  .get(getAReview)
  .patch(protectRoute(User), updateReview)
  .delete(protectRoute(User), deleteReview);

module.exports = reviewRouter;
