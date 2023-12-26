import crypto from "crypto";
import cloudinary from "cloudinary";

import ErrorHandler from "../utills/errorHandler.js";
import asyncErrorHandler from "../middleware/asyncError.js";
import User from "../models/userModel.js";
import sendToken from "../utills/jwtAuth.js";
import sendEmail from "../utills/sendEmail.js";

const registerUser = asyncErrorHandler(async (req, res) => {
  let myCloud;

  console.log("hit register", req.body);

  const { name, email, password, avatar } = req.body;

  const userData = {
    name,
    email,
    password,
  };

  if (avatar && avatar.length > 0) {
    console.log("reg if ");
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    userData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.create(userData);

  sendToken(user, 201, res);
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  console.log("hit2");
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Null Values", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password"), 400);
  }

  sendToken(user, 200, res);
});

const logout = asyncErrorHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Generate reset token
const generateResetToken = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("Invalid email", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUri = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `To reset Password please visit this link ${resetUri}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecomerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      status: `Email sent Successfully to ${user.email}`,
      message,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = req.params.token;

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Link Invalid or expired", 400));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password not match", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get my details

const getMyDetails = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Update password

const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isMatchPassword = await user.comparePassword(req.body.password);

  if (!isMatchPassword) {
    return next(new ErrorHandler("Invalid password"), 400);
  }

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return next(new ErrorHandler("Password not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin Routes

//Get All user   -- Admin
const getAllUser = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user   --Admin
const getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found"), 400);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user role
const updateRole = asyncErrorHandler(async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete a user
const deleteUSer = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found"), 400);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export {
  getAllUser,
  getUser,
  updateRole,
  deleteUSer,
  registerUser,
  updateProfile,
  loginUser,
  logout,
  generateResetToken,
  resetPassword,
  getMyDetails,
  updatePassword,
};
