const Product = require('../models/product');
const Inventory = require('../models/inventory');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .fields()
    .sort()
    .paginate();
  const products = await features.query;
  res.status(200).json({
    status: 'success',
    total: products.length,
    data: {
      products,
    },
  });
});

exports.getAProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews',
    select: 'review rating images createAt -productId',
  });
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.createAProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  await Inventory.create({
    productId: product._id,
    quantity: req.body.quantity ? req.body.quantity : 0,
  });
  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (req.body.quantity)
    await Inventory.updateOne(
      { productId: id },
      { quantity: req.body.quantity }
    );
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  await Inventory.deleteOne({ productId: id });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
