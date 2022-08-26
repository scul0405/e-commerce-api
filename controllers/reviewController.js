const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const checkValidUser = async (user, reviewId, next) => {
  const review = await Review.findById(reviewId);
  if (!review.userId.equals(user.id))
    return next(new AppError(`You don't have permission to do this`, 401));
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    total: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getAReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'userId',
    select: 'username',
  });
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createAReview = catchAsync(async (req, res, next) => {
  if (req.params.productId) req.body.productId = req.params.productId;
  req.body.userId = req.user.id;
  // Handle when review by user already created
  const createdReview = await Review.findOne({
    userId: req.body.userId,
    productId: req.body.productId,
  });
  if (createdReview)
    return next(new AppError(`Your review on this product already exist`, 400));

  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  await checkValidUser(req.user, req.params.id, next);
  const updateReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updateReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await checkValidUser(req.user, req.params.id, next);
  await Review.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
