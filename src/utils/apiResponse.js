const { StatusCodes } = require("http-status-codes");

class ApiResponse{
    
    constructor(statusCode=StatusCodes.OK, data={}, message="Success", res=null){
        this.statusCode = statusCode;
        this.success = statusCode >= StatusCodes.OK && statusCode < StatusCodes.MULTIPLE_CHOICES;
        this.message = message;
        this.data = data;

        if(res){
            this.send(res);
        }
    }
    toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        };
    }
    
    send(res) {
        return res.status(this.statusCode).json(this.toJSON());
    }    
}

module.exports = ApiResponse;