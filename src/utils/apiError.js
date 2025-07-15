class ApiError extends Error {
    constructor(statusCode, message = "Something Went Wrong", error = null, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.error = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            success: false,
            statusCode: this.statusCode,
            message: this.message,
            error: this.error,
        };
    }
}

module.exports=ApiError;