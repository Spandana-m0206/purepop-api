const {StatusCodes} = require("http-status-codes");
const ApiError = require("../utils/apiError");
const { Roles } = require("../utils/enums");

exports.isAdmin = async(req, res, next) => {
    if(req.user.role===Roles.ADMIN){
        next();
    }
    else{
      res.status(StatusCodes.FORBIDDEN).json(new ApiError(StatusCodes.FORBIDDEN,"Access denied"));
    }
}