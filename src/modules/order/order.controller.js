const BaseController=require('../base/BaseController');
const ApiResponse=require('../../utils/apiResponse');
const ApiError=require('../../utils/apiError');
const {StatusCodes}=require('http-status-codes');
const productService = require('../product/product.service');
const cartService = require('../cart/cart.service');
const orderService = require('./order.service');
const { PaymentMethods } = require('../../utils/enums');
class CartController extends BaseController{

    constructor(){
        super(orderService, "Product");
    }

    async create(req,res,next){
        try {
            const {shippingAddress, paymentMethod } = req.body;
            if(!shippingAddress ){
                return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "Please provide shipping address"))
            }
            if(!paymentMethod ){
                return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST, "Please select payment method"))
            }
            let cartProducts = await cartService.find({user:req.user._id, quantity: {$gt: 0}}) || [];
            if(cartProducts.length == 0){
                return res.status(StatusCodes.NOT_FOUND).json(new ApiError(StatusCodes.NOT_FOUND, "Cart is Empty"))
            }
            let itemsNotInStock= []
            const items = cartProducts.map(item=>{
                if(item.quantity> item.product.totalQuantity){
                    itemsNotInStock.push(item)
                }
                return {
                product: item.product._id,
                price: item.product.amount,
                quantity: item.quantity
            }})
            if(itemsNotInStock.length > 0) {
                return res.status(StatusCodes.NOT_FOUND).json(new ApiError(StatusCodes.NOT_FOUND, "Some items are out of stock, please remove it fro the cart"))                
            }
            let isPaid = false;
            if(paymentMethod !== PaymentMethods.COD){
                // TODO: make a service for making payment using payment gateway providers like Stripe or Razorpay

            }
            const orderDetails = {
                user: req.user._id,
                items,shippingAddress, paymentMethod, isPaid
            }
            const order = await orderService.create(orderDetails)

            // Decrement Stock / Update Stock
            for(let orderedItem of order.items){
                const product = await productService.findById(orderedItem.product)
                await productService.update({_id: orderedItem.product}, product.totalQuantity - items.find(itm=>itm.product._id.toString() == orderedItem.product.toString()))
            }

            return new ApiResponse(res,StatusCodes.OK,{order},"Order Created",res);


        } catch (error) {
            return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something Went Wrong'));

        }
    }  


    async find(req, res, next){
        const orders = await orderService.find({user:req.user._id})
        return new ApiResponse(res,StatusCodes.OK,{orders},"Order Fetched Successfully",res);
    }   

    async findOne(req, res, next){
        const order = await orderService.findOne({user:req.user._id, _id: req.params.id})
        return new ApiResponse(res,StatusCodes.OK,{order},"Order Fetched Successfully",res);
    }   
     
}

module.exports = new CartController();