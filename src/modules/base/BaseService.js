const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../utils/apiError");
const OPERATION_TYPES = require("./utils/baseOperationTypes");


class BaseService{
    
    constructor(model){
        if(!model){
            throw new Error('Model is required to initialize BaseService');
        }
        this,model = model;
    }

   async handleOperation(operation, operationName , ...args){
        try {
            return await operation(...args);
        } catch (error) {
             console.log(`[BaseService Error - ${operationName}]: ${error.message}`);    
             throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to perform ${operationName}`, error);        
        }
    }

    async create(data){
        return this.handleOperation(this.model.create.bind(this.model), OPERATION_TYPES.CREATE, data);
    }

    async createBulk(dataArray){
        if(! Array.isArray(dataArray) || dataArray.length ===0){
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Data array is required for bulk creation');            
        }
        return this.handleOperation(this.model.insertMany.bind(this.model), OPERATION_TYPES.CREATE_BULK, dataArray);
    }
   async find(filter = {}, projection = {}, options = {}) {
        return this.handleOperation(this.model.find.bind(this.model), OPERATION_TYPES.FIND, filter, projection, options);
    }

    async findById(id) {
        if(!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'ID is required.');
        return this.handleOperation(this.model.findById.bind(this.model), OPERATION_TYPES.FIND_BY_ID, id);
    }

    async findOne(filter = {}, projection = {}, options = {}) {
        return this.handleOperation(this.model.findOne.bind(this.model), OPERATION_TYPES.FIND_ONE, filter, projection, options);
    }

    async update(filter, updateData, options = {}) {
        return this.handleOperation(this.model.updateMany.bind(this.model), OPERATION_TYPES.UPDATE_MANY, filter, updateData, options);
    }

    async updateOne(filter, updateData, options = {}) {
        return this.handleOperation(this.model.updateOne.bind(this.model), OPERATION_TYPES.UPDATE_ONE, filter, updateData, options);
    }

    async delete(filter) {
        return this.handleOperation(this.model.deleteMany.bind(this.model), OPERATION_TYPES.DELETE_MANY, filter);
    }

    async deleteOne(filter) {
        return this.handleOperation(this.model.deleteOne.bind(this.model), OPERATION_TYPES.DELETE_ONE, filter);
    }

    async findPaginated(filter = {}, page = 1, limit = 10, projection = {}, options = {}) {
        try {
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const skip = (page - 1) * limit;

            const [data, totalCount] = await Promise.all([
                this.model.find(filter, projection, options).skip(skip).limit(limit),
                this.model.countDocuments(filter)
            ]);
            return {
                data,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            };
        } catch (error) {
            logger.error(`[BaseService Error - findPaginated]: ${error.message}`);
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to fetch paginated data', error);
        }
    }

    async findOneAndUpdate(filter, updateData, options = {}) {
        return this.handleOperation(
            this.model.findOneAndUpdate.bind(this.model),
            OPERATION_TYPES.FIND_ONE_AND_UPDATE,
            filter,
            updateData,
            options
        );
    }
}

module.exports =BaseService;
