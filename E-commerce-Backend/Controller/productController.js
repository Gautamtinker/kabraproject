import Product from "../models/productModel.js";
import ErrorHandler from "../utills/errorHandler.js";
import asyncErrorHandler from "../middleware/asyncError.js";
import ApiFeature from "../utills/apifeatures.js";

const createProduct = async (req, res) => {
  req.body.user = req.user.id;

  const data = req.body;
  console.log(data);
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

const getAllProduct = asyncErrorHandler(async (req, res, next) => {
  const resPerPage = 8;

  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  console.log(apiFeature);

  let product = await apiFeature.query; // Product.find({name : { $regex : req.query.keyword, $options : "i"}});
  console.log(product);
  res.status(200).send({
    message: "working fine",
    product,
    productCount,
    resPerPage,
  });
});

const updateProduct = asyncErrorHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      status: "false",
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct = asyncErrorHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      status: "false",
      message: "Product not found",
    });
  }

  console.log(product);
  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "deleted successfully",
  });
});

const getProduct = asyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  console.log(product);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Add a review or update
const addReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const data = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user.id,
  };

  const product = await Product.findById(productId);

  let isReviewed = false;

  let reviewLength = product.reviews.length;
  let productRating = product.rating;

  product.reviews.forEach((ele) => {
    if (ele.user.toString() === req.user._id.toString()) {
      // update OverAll Rating
      product.rating =
        (productRating * reviewLength - ele.rating + Number(rating)) /
        reviewLength;

      ele.rating = Number(rating);
      ele.comment = comment;
      isReviewed = true;
    }
  });

  if (!isReviewed) {
    product.reviews.push(data);

    // update Overall Rating
    product.rating =
      (productRating * reviewLength + Number(rating)) / (reviewLength + 1);

    product.numOfRevies = product.reviews.length;
  }

  await product.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
  });
});

// Get all review
const getAllReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found"), 400);
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete review
const deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.body.id);

  if (!Product) {
    return next(new ErrorHandler("Product not found"), 400);
  }

  let isDeleted = false;
  let newRating;

  const reviews = product.reviews.filter((ele) => {
    if (ele.user.toString() !== req.user._id.toString()) return true;
    else {
      newRating = Number(ele.rating);
      isDeleted = true;
      return false;
    }
  });

  let { rating, numOfRevies } = product;

  if (isDeleted) {
    rating =
      (product.rating * product.numOfRevies - newRating) / reviews.length;
    numOfRevies = reviews.length;
  }

  await Product.findByIdAndUpdate(
    req.body.id,
    {
      reviews,
      rating,
      numOfRevies,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );

  res.status(200).json({
    success: true,
  });
});

const searchProduct = asyncErrorHandler(async (req, res) => {
  const { name } = req.body;

  //console.log(name);

  let product;

  if (name && name.length > 0) {
    product = await Product.find({
      name: { $regex: new RegExp(name, "i") },
    })
      .select("name")
      .exec();
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export {
  addReview,
  getAllReview,
  deleteReview,
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  searchProduct,
};
