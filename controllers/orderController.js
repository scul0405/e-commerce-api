const Order = require('../models/order');
const Inventory = require('../models/inventory');
const Cart = require('../models/cart');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ status: 'pending' });
  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });
});

exports.getAnOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'cartId',
      populate: {
        path: 'products.productId',
      },
    })
    .populate('userId');
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.createAnOrder = catchAsync(async (req, res, next) => {
  if (!req.body.userId) req.body.userId = req.user.id;
  const order = await Order.create(req.body);
  // update cart active status
  const cart = await Cart.findByIdAndUpdate(req.body.cartId, {
    active: false,
  });
  // get all products in inventory appearance in cart
  const inventories = await Promise.all(
    cart.products.map(
      async (product) =>
        await Inventory.findOne({ productId: product.productId })
    )
  );
  // update reservations
  Promise.all(
    inventories.map(async (productInventory, index) => {
      if (cart.products[index].quantity > productInventory.quantity)
        return next(new AppError('Invalid quantity', 400));
      // update quantity before save
      productInventory.quantity -= cart.products[index].quantity;

      productInventory.reservations.push({
        cartId: cart._id,
        quantity: cart.products[index].quantity,
      });
      return await productInventory.save();
    })
  );
  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// HANDLE ORDER

const acceptOrder = async (cartIdToDelete, products) => {
  const inventories = await Promise.all(
    products.map(
      async (product) =>
        await Inventory.findOne({ productId: product.productId })
    )
  );
  await Promise.all(
    inventories.map(async (productInventory) => {
      productInventory.reservations = productInventory.reservations.filter(
        (cart) => !cart.cartId.equals(cartIdToDelete)
      );
      return await productInventory.save();
    })
  );
};

const rejectOrder = async (cartIdToDelete, products) => {
  const inventories = await Promise.all(
    products.map(
      async (product) =>
        await Inventory.findOne({ productId: product.productId })
    )
  );
  await Promise.all(
    inventories.map(async (productInventory) => {
      const indexOfDeleteCart = productInventory.reservations.findIndex(
        (cart) => cart.cartId.equals(cartIdToDelete)
      );
      const quantityToGetBack =
        productInventory.reservations[indexOfDeleteCart].quantity;
      productInventory.reservations = productInventory.reservations.filter(
        (cart) => !cart.cartId.equals(cartIdToDelete)
      );
      productInventory.quantity += quantityToGetBack;
      return await productInventory.save();
    })
  );
};

exports.handleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('cartId');
  const { products } = order.cartId;
  const cartId = order.cartId._id;
  if (req.body.status === 'accept') await acceptOrder(cartId, products);
  else await rejectOrder(cartId, products);
  order.status = req.body.status;
  await order.save();
  res.status(200).json({
    status: req.body.status,
  });
});
