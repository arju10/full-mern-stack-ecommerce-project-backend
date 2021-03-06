const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

// Display all products => ("/api/v1/products?keyword=kd") [method : "GET"] (Alternative but best method) = > Apply catchAsyncError for handling Async Error
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  // find()=== SELECT * from x
  // const getAllProducts = await Product.find();
  console.log(req.query);
  const resPerPage = 2;

  const productCount = await Product.countDocuments()

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const getAllProducts = await apiFeatures.query;

  res.status(200).json({
    success: true,
    // message: "This shows all products",
    count: getAllProducts.length,
    productCount,
    getAllProducts,
  });
  console.log(
    "Number of Products available in Database : ",
    getAllProducts.length
  );
});

// Get Single Product Details => ("/api/v1/product/:id") [method:"GET"]  (Alternative but best method) = > Apply catchAsyncError for handling Async Error

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404)); // Apply Error Handler Class to control error!
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// create new product => ("/api/v1/product/new") [method : 'POST']  (Alternative async error handle)
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  // console.log(user);
  req.body.user = req.user.id;

  // Saving Data to the Database
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
    message: "Product is created successfully!",
  });
  console.log("Product is created successfully!!!!");
});

// Update product => ("/api/v1/admin/product/:id") [method : "PUT"] (Alternative async error handle)
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  // Finding the product
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404)); // Apply Error Handler Class to control error!
  }
  // Saving/Updating the product
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    product,
    message: "Product is updated successfully",
  });
});

// Delete product from database => ("/api/v1/admin/product/:id") [method : "DELETE"] (Alternative async error handle)
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  // Finding the product
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404)); // Apply Error Handler Class to control error!
  }

  // Deleting the product
  // product = await Product.remove();
  product.remove();
  res.status(200).json({
    success: true,
    message: "Product is Deleted Successfully!",
  });
});

// Create new review => /api/v1/review [PUT]
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  console.log(product);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// GET PRODUCT Reviews => api/v1/reviews ["GET"]
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// DELETE PRODUCT REVIEWS => /api/v1/reviews [DELETE] [Pid, id]
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review.user.toString() !== req.query.id.toString()
  );

  const numberOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});

// >>>>>>>>>>>>>>>>>>>>>>>>>> ALL ALTERNATIVE WAY >>>>>>>>>>>>>>>>>>>>>>>>>

// // Display all products => ("/api/v1/products") [method : "GET"] (try .. catch >>>> use for Handling Async Error )
// exports.getProducts = async (req, res, next) => {
//   try {
//     // find()=== SELECT * from x
//     const getAllProducts = await Product.find();

//     res.status(200).json({
//       success: true,
//       // message: "This shows all products",
//       count: getAllProducts.length,
//       getAllProducts,
//     });
//     console.log(
//       "Number of Products available in Database : ",
//       getAllProducts.length
//     );
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// Get Single Product Details => ("/api/v1/product/:id") [method:"GET"]     (try .. catch >>>> use for Handling Async Error )

// exports.getSingleProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if(!product){
//       return next(new ErrorHandler("Product not found!", 404));  // Apply Error Handler Class to control error!

//       // return res.status(404).json({
//       //   success: false,
//       //   message : "Product not found"
//       // })
//     }

//     res.status(200).json({
//       success: true,
//       product
//     })
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// Create new product => ("/api/v1/admin/product/new") [method : "POST"]
// exports.newProduct = async(res, req, next) => {
//     saving the product/data to the database
//     const product = await Product.create(req.body);
//     res.status(201).json({
//         success:true,
//         product
//     });
// };

// create new product => ("/api/v1/product/new") [method : 'POST']  (Alternative)
// exports.newProduct = async (req, res, next) => {
//   try {
//     // Saving Data to the Database
//     const product = await Product.create(req.body);
//     res.status(201).json({
//       success: true,
//       product,
//       message: "Product is created successfully!",
//     });
//     console.log("Product is created successfully!!!!");
//   } catch (error) {
//     console.log("Product isn't created successfully", error);
//   }
// };

// Update product => ("/api/v1/admin/product/:id") [method : "PUT"]
// exports.updateProduct = async (req, res, next) => {
//   // Finding the product
//   let product = await Product.findById(req.params.id);
//   if (!product) {
//     return res.status(404).json({
//       success: true,
//       message: "Product isn't found",
//     });
//   }
//   // Saving/Updating the product
//   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: true,
//   });

//   res.status(200).json({
//     success: true,
//     product,
//     message: "Product is updated successfully",
//   });
// };

// Delete product from database => ("/api/v1/admin/product/:id") [method : "DELETE"]
// exports.deleteProduct = async (req, res, next) => {
//   try {
//     // Finding the product
//     const product = await Product.findById(req.params.id);
//     if(!product){
//       return res.status(404).json({
//         success: false,
//         message: "Product isn't found"
//       });
//     }

//     // Deleting the product
//     // product = await Product.remove();
//     product.remove();
//     res.status(200).json({
//       success: true,
//       message:"Product is Deleted Successfully!"
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
