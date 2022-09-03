const Cart = require('../models/cart');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createDefaultCart = async (userId) => {
  const cart = await Cart.create({
    userId: userId,
    products: [],
  });
  return cart;
};

const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ userId, active: true }).populate({
    path: 'products.productId',
    select: 'name image price discount',
  });
  if (!cart) cart = await createDefaultCart(userId);
  return cart;
};

exports.getUserCart = catchAsync(async (req, res, next) => {
  const cart = await getCartByUserId(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      total: cart.length,
      cart,
    },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const cart = await getCartByUserId(req.user.id);
  const updateProductIndex = cart.products.findIndex((product) =>
    product.productId.equals(req.params.productId)
  );
  // if item is existed -> update only quantity, else add new product
  if (updateProductIndex !== -1)
    cart.products[updateProductIndex].quantity += req.body.quantity;
  else
    cart.products.push({
      productId: req.params.productId,
      quantity: req.body.quantity,
    });
  await cart.save();
  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    userId: req.user.id,
    active: true,
  }).populate({
    path: 'products.productId',
    select: 'name image price discount',
  });
  if (!cart) return next(new AppError(`This user's cart does not exist`, 404));
  req.body.products.forEach((updateProduct) => {
    const updateProductIndex = cart.products.findIndex((currentProduct) =>
      currentProduct.productId.equals(updateProduct.productId)
    );
    cart.products[updateProductIndex].quantity = updateProduct.quantity;
  });
  console.log(cart);
  await cart.save();
  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});
