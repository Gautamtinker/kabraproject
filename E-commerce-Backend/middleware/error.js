import ErrorHandler from "../utills/errorHandler.js";

const customError = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server error"

    // Mongo Invalid ID error
    if(err.name == "CastError"){
        const msg = `Cast Error : something Invalid, Invalid ${err.path} ${err}`;
        err = new ErrorHandler(msg, 400);
    }

    // Duplicate key error
    if(err.code === 11000){
        const msg = `Duplicate ${Object.keys(err.keyValue)}`
        err = new ErrorHandler(msg, 400);
    }

    //JWT Error
    if(err.name === "jsonwebtokenError"){
        const msg = `Invalid JWT`
        err = new ErrorHandler(msg, 400); 
    }

    //JWT Expire
    if(err.name === "TokenExpiredError"){
        const msg = `Token Expired`
        err = new ErrorHandler(msg, 400);
    }

    res.status(err.statusCode).json({
        status : false,
        message : err.message
    })

}

export default customError;