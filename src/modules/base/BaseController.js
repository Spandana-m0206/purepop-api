const { StatusCodes } = require("http-status-codes");
const ApiResponse = require("../../utils/apiResponse");
const ApiError = require("../../utils/apiError");

class BaseController {
    constructor(service, resourceName='base') {
        if (!service) {
            throw new Error(`Service is required to initialize ${this.resourceName}Controller`);
        }
        this.service = service;
        this.resourceName = resourceName;
    }

    async create(req, res, next) {
        try {
            const data = await this.service.create(req.body);
            return new ApiResponse(res, StatusCodes.CREATED, `${this.resourceName} created successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - create]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create ${this.resourceName}`, error));
        }
    }

    async createBulk(req, res, next) {
        try {
            const data = await this.service.createBulk(req.body);
            return new ApiResponse(res, StatusCodes.CREATED, `${this.resourceName}s created successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - createBulk]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create ${this.resourceName}s`, error));
        }
    }

    async find(req, res, next) {
        try {
            const data = await this.service.find(req.query);
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName}s retrieved successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - find]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to retrieve ${this.resourceName}s`, error));
        }
    }

    async findById(req, res, next) {
        try {
            const data = await this.service.findById(req.params.id);
            if (!data) {
                return next(new ApiError(StatusCodes.NOT_FOUND, "Resource not found"));
            }
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName} retrieved successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - findById]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to retrieve ${this.resourceName}`, error));
        }
    }

    async findOne(req, res) {
        try {
            const data = await this.service.findOne(req.query);
            if (!data) {
                return next(new ApiError(StatusCodes.NOT_FOUND, `${this.resourceName} not found`));
            }
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName} retrieved successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - findOne]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to retrieve ${this.resourceName}`, error));
        }
    }

    async update(req, res) {
        try {
            const data = await this.service.updateOne({ _id: req.params.id }, req.body, { new: true });
            if(!data) {
                return next(new ApiError( StatusCodes.NOT_FOUND,`${this.resourceName} not found` ));
            }
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName} updated successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - update]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update ${this.resourceName}`, error));
        }
    }

    async updateMany(req, res, next) {
        try {
            const data = await this.service.update(req.query, req.body);
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName}s updated successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - updateMany]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update ${this.resourceName}s`, error));
        }
    }

    async delete(req, res) {
        try {
            const data = await this.service.deleteOne({ _id: req.params.id });
            if(!data) {
                return next(new ApiError( StatusCodes.NOT_FOUND,`${this.resourceName} not found` ));
            }
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName} deleted successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - delete]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete ${this.resourceName}`, error));
        }
    }

    async deleteMany(req, res, next) {
        try {
            const data = await this.service.delete(req.query);
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName}s deleted successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - deleteMany]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete ${this.resourceName}s`, error));
        }
    }

    async findOneAndUpdate(req, res, next) {
        try {
            const data = await this.service.findOneAndUpdate(req.query, req.body, { new: true });
            if (!data) {
                return next(new ApiError(StatusCodes.NOT_FOUND, "Resource not found"));
            }
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName} updated successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - findOneAndUpdate]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update ${this.resourceName}`, error));
        }
    }

    async findPaginated(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const data = await this.service.findPaginated(req.query, page, limit);
            return new ApiResponse(res, StatusCodes.OK, `${this.resourceName}s retrieved successfully`, data);
        } catch (error) {
            console.error(`[${this.resourceName}Controller Error - findPaginated]: ${error.message}`);
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to retrieve ${this.resourceName}s`, error));
        }
    }
}

module.exports = BaseController;