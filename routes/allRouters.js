const adminRouter = require('./adminRoutes');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const productRouter = require('./productRoutes');
const reviewRouter = require('./reviewRoutes');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');

const allRouters = {
  adminRouter,
  userRouter,
  authRouter,
  productRouter,
  reviewRouter,
  cartRouter,
  orderRouter,
};

module.exports = allRouters;
