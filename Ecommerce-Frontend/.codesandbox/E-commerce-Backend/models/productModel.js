import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , "Please enter name"]
    },
    description : {
        type : String,
        required : [true, "Please enter description"]
    },
    price : {
        type : Number,
        required : [true, "Please enter Price"],
        maxLength : [8, "exceeds limit"]
    },
    rating : {
        type : Number,
        default : 0
    },
    images : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],

    category : {
        type : String,
        required : [true, "Please enter category"]
    },
    Stock : {
        type : Number,
        required : [true, "Please enter Stock"],
        maxLength : [4, "Limit exceeds"],
        default : 1
    },
    numOfRevies : {
        type : Number,
        default : 0
    },
    reviews : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : "User"
            },
            name : {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            },
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now()
    }    

});

const Product = mongoose.model("product",productSchema);

export default Product;