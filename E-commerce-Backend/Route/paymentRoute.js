import express from "express";
import {payment, getSession } from "../Controller/paymentController.js";

const router = express.Router();

router.route("/payment/process").post(payment);
router.route("/payment/session").get(getSession);

export default router;
