const express = require("express");
const { newOrder, getSingleOrder, myOrder, allOrders } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();


router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrder);

router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles("admin"), allOrders);





module.exports = router;
