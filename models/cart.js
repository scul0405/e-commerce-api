const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
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
    totalMoney: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre('save', function (next) {
  this.totalMoney = this.products.reduce(
    (prevTotal, product) =>
      prevTotal + product.productId.discountPrice * product.quantity,
    0
  );
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
