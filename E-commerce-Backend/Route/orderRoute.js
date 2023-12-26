import express from "express";
import { createOrder, deleteOrder, getAllOrder, getMyOrder, getSingleOrder, updateOrderStatus } from "../Controller/orderController.js";
import { authorizeRoles, isAuthUser } from "../middleware/auth.js";


const router = express.Router();

router.route("/order/new").post(isAuthUser, createOrder);
router.route("/order/me").get(  isAuthUser, getMyOrder);
router.route("/order/:id").get(isAuthUser, getSingleOrder);

router.route("/admin/orders").get(isAuthUser,authorizeRoles("admin"), getAllOrder);

router.route("/admin/order/:id")
.put(isAuthUser, authorizeRoles("admin"), updateOrderStatus)
.delete(isAuthUser, authorizeRoles("admin"), deleteOrder);


export default router;