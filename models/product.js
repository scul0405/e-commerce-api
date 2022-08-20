const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'A product must have price'],
    min: [0, 'Price must be at least 0'],
  },
  discount: {
    type: Number,
    min: [0, 'Discount must be at least 0'],
    max: [100, 'Discount must be smaller than 100'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  image: {
    type: [String],
    required: [true, 'A product must have at least 1 image'],
  },
  quantitySold: {
    type: Number,
    default: 0,
  },
});

productSchema.virtual('discountPrice').get(function () {
  return Math.round((this.price * (100 - this.discount)) / 100);
});

productSchema.pre(/^find/, function (next) {
  this.find({ $ne: { status: false } });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
