const ApiError= require('../utils/apiError');
const { StatusCodes } = require("http-status-codes");

exports.ErrorMiddleware = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }

    const internalError = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
    );

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalError.toJSON());
};