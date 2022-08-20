const Product = require('../models/product');
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

exports.createAProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);
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
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
