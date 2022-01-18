const Product = require("../models/product");

// find()=== SELECT * from x
exports.getProducts =async (req, res, next) => {
  try {
    const getAllProducts = await Product.find();

    res.status(200).json({
      success: true,
      // message: "This shows all products",
      count:getAllProducts.length,
      getAllProducts
    });
    console.log("Number of Products available in Database : ",getAllProducts.length);
  } catch (error) {
    console.log(error.message);
  }

};

// Create new product => ("/api/v1/admin/product/new") [method : "POST"]
// exports.newProduct = async(res, req, next) => {
//     saving the product/data to the database
//     const product = await Product.create(req.body);
//     res.status(201).json({
//         success:true,
//         product
//     });
// };

// Alternative new product => ("/api/v1/product/new") [method : 'Post']
exports.newProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
      message: "Product is created successfully!",
    });
    console.log("Product is created successfully!!!!");
  } catch (error) {
    console.log("Product isn't created successfully", error);
  }
};

// Update product => ("/api/v1/admin/product/:id") [method : "PUT"]
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: true,
      message: "Product isn't updated",
    });
  }

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
};
