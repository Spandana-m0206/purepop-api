const BaseService=require('../base/BaseService');
const CartModel =require('./cart.model');

class CartService extends BaseService{
    constructor(){
        super(CartModel)
    }

    async find(filter={}) {
        return await this.model.find(filter).populate('product');
    }
}

module.exports = new CartService();