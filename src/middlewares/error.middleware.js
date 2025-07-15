const ApiError= require('../utils/apiError');
const { StatusCodes } = require("http-status-codes");

module.export=(err, req, res, next)=>{
    if(err instanceof ApiError){
        console.error(`API Error: ${err.message}`, { statusCode: err.statusCode, error: err.error });
        return res.status(err.statusCode).json(err.toJSON());        
    }
    console.error(`Unexpected Error: ${err.message}`, { stack: err.stack });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,  "Internal Server Error"));
}