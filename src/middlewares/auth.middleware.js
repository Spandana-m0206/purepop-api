const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const ApiError =require('../utils/apiError');
const userService = require('../modules/user/user.service');

exports.authMiddleware = async(req, res, next)=>{
    try {
        const authHeader = req.headers["authorization"];
        if(!authHeader || !authHeader.startsWith("Bearer ")){
                next(new ApiError(StatusCodes.UNAUTHORIZED, "Access Denied"));
        }
        const token =authHeader.split(" ")[1];

        if(!token){
           next(new ApiError(StatusCodes.UNAUTHORIZED, "Access denied"));  
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            next(new ApiError(StatusCodes.UNAUTHORIZED, "Access Denied"));
        }
        const user = await userService.findById(decode.userId);
        if (!user) {
            next(new ApiError(StatusCodes.NOT_FOUND, "User not found"));
        }
        req.user = user;
        req.user.userId = user._id.toString();
        next();           
        
    } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Token expired"));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Invalid token"));
    }
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
  }        
};
