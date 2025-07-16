const BaseService=require('../base/BaseService');
const ProductModel =require('./product.model');

class ProductService extends BaseService{
    constructor(){
        super(ProductModel)
    }
}

module.exports = new ProductService();