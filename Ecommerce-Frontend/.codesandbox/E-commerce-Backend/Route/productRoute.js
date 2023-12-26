import express from "express";
import {
  addReview,
  createProduct,
  deleteProduct,
  deleteReview,
  getAllProduct,
  getAllReview,
  getProduct,
  updateProduct,
  searchProduct,
} from "../Controller/productController.js";
import { isAuthUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/products").get(getAllProduct);

router.route("/admin/products").get(getAllProduct);

router
  .route("/admin/product/new")
  .post(isAuthUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/search").post(searchProduct);

router.route("/product/:id").get(getProduct);

router.route("/review").put(isAuthUser, addReview);

router.route("/reviews").get(getAllReview).delete(isAuthUser, deleteReview);

export default router;
