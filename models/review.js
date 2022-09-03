const mongoose = require('mongoose');
const Product = require('./product');

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calculateAverageRatingsAndQuantityRatings =
  async function (productId) {
    const stats = await this.aggregate([
      {
        $match: { productId: productId },
      },
      {
        $group: {
          _id: '$productId',
          quantityRatings: { $sum: 1 },
          averageRatings: { $avg: '$rating' },
        },
      },
    ]);
    await Product.findByIdAndUpdate(productId, {
      quantityRatings: stats[0].quantityRatings,
      averageRatings: stats[0].averageRatings.toFixed(1),
    });
  };

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRatingsAndQuantityRatings(this.productId);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
