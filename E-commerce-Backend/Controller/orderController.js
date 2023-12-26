import ErrorHandler from "../utills/errorHandler.js";
import asyncErrorHandler from "../middleware/asyncError.js"
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";


const createOrder = asyncErrorHandler(async(req,res)=>{
    const {
        shippingInfo,
        itemInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;

      const order = await Order.create({
        shippingInfo,
        itemInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user.id,
      });

      res.status(201).json({
        success: true,
        order,
      });
})

const getSingleOrder = asyncErrorHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id).populate("user","name email role");

    if(!order){
        return next(new ErrorHandler("Order not found", 400));
    }

    res.status(200).json({
        success : true,
        order
    })

})

//get logged in user orders
const getMyOrder = asyncErrorHandler(async(req,res)=>{

    const orders = await Order.find({user : req.user.id});

    res.status(200).json({
        success: true,
        orders,
    })
})

// Admin routes

//get all order
const getAllOrder = asyncErrorHandler(async(req,res)=>{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach( ele=>{
        totalAmount += ele.totalPrice;
    } );

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })

})

// update order status
const updateOrderStatus = asyncErrorHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if(req.body.status === "shipped"){
    order.itemInfo.forEach(async (ele)=>{
        await updateStock(ele.product, ele.quantity);
    })
  }

  order.status = req.body.status;

  if(order.status === "Delevired"){
    order.deleviredAt = Date.now();
  }

  await order.save({validateBeforeSave : false})
  
  res.status(200).json({
    success : true,
  });

})

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({validateBeforeSave : false})

}

// delete order
const deleteOrder = asyncErrorHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found", 400));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true
    })

})

export {createOrder, getSingleOrder, getMyOrder, getAllOrder, updateOrderStatus, deleteOrder};