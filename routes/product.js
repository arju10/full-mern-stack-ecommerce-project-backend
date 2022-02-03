const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  updateProduct,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router
  .route("/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getProducts);
router.route("/product/:id").get(getSingleProduct);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
