import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo : {
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        country : {
            type : String,
            required : true
        },
        pincode : {
            type : Number,
            required : true
        },
        phone : {
            type : Number,
            required : true
        },
    },
    itemInfo :[{
        name : {
            type : String,
            required : true
        },
        quantity : {
            type : Number,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        images : {
            type : String,
            required : true
        },
        product  : {
            type : mongoose.Schema.ObjectId,
            ref : "Products",
            required : true
        }
    }],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    orderedAt : {
        type : Date,
        required : true,
        default : Date.now(),
    },
    paidAt : {
        type : Date,
        required : true
    },
    itemsPrice : {
        type : Number,
        required : true
    },
    shippingPrice : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : "Processing"
    },
    paymentInfo : {
        id : {
            type : String,
            required : true
        },
        status : {
            type : String,
            required : true
        },
    },
    taxPrice : {
        type : Number,
        required : true
    },
    totalPrice : {
        type : Number,
        required : true
    },
    deleviredAt : {
        type : Date
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now(),
    },
})

const Order = mongoose.model("Order", orderSchema);

export default Order;