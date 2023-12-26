import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import productRoute from "./Route/productRoute.js";
import user from "./Route/userRoute.js";
import customError from "./middleware/error.js";
import order from "./Route/orderRoute.js";
import payRoute from "./Route/paymentRoute.js";

dotenv.config({ path: "config/config.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/api/v1", productRoute);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payRoute);

app.use(customError);

export default app;
