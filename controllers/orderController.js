const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// Create New Order => "/api/v1/order/new"  ["POST"]
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(200).json({
    success: true,
    message: "Order is created successfully!",
    order,
  });
});

// Get Single Order => "/api/v1/order/:id" ["GET"]
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("No order found with this ID"), 404);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get All Orders => "/api/v1/orders/me" ["GET"]
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin

// Get all orders - ADMIN - "/api/v1/admin/orders"  ["GET"]
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount = totalAmount + order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
