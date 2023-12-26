import User from "../models/userModel.js";
import ErrorHandler from "../utills/errorHandler.js";
import asyncError from "./asyncError.js";
import jwt from "jsonwebtoken";

const isAuthUser = asyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    
    if(!token){
        return next(new ErrorHandler("Please Login to continue", 401));
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeToken.id);

    next();

})

const authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler("You are not authorized to access this resource", 403));
        }
        next();
    }
}

export  {isAuthUser, authorizeRoles};