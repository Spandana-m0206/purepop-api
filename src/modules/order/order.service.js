const BaseService=require('../base/BaseService');
const OrderModel =require('./order.model');

class OrderService extends BaseService{
    constructor(){
        super(OrderModel)
    }

}

module.exports = new OrderService();