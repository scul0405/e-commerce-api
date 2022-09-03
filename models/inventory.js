const mongoose = require('mongoose');

const { Schema } = mongoose;

const inventorySchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    reservations: [
      {
        cartId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Cart',
        },
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
