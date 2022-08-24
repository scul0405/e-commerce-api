const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, 'A review must not be empty'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A review must have a rating'],
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
