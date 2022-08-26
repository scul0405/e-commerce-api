const mongoose = require('mongoose');
const Product = require('./product');

const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      status: {
        type: Boolean,
        default: true,
      },
    },
  ],
  modifiedOn: {
    type: Date,
    default: Date.now(),
  },
});

cartSchema.pre('save', function () {
  this.modifiedOn = Date.now();
});

// cartSchema.virtual('totalMoney').get(function () {
//   const productPromiseArray = this.products.map(
//     async (product) => await Product.find(product.productId)
//   );
//   const totalMoney = 0;
//   return totalMoney;
// });
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
