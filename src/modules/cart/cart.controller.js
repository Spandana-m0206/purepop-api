const BaseController=require('../base/BaseController');
const ApiResponse=require('../../utils/apiResponse');
const ApiError=require('../../utils/apiError');
const {StatusCodes}=require('http-status-codes');
const productService = require('../product/product.service');
const cartService = require('./cart.service');
class CartController extends BaseController{

    constructor(){
        super(cartService, "Cart");
    }

    async create(req,res,next){
        try {
            const {product, quantity = 1 } = req.body
            const productExisted = await productService.findById(product);
            if(!productExisted){
                return res.status(StatusCodes.NOT_FOUND).json(new ApiError(StatusCodes.NOT_FOUND, "Product not found"))
            }
            await cartService.create({user:req.user._id, product, quantity})
            return new ApiResponse(res,StatusCodes.OK,{product},"Service Area Created",res);

        } catch (error) {
            return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something Went Wrong'));

        }
    }  
    async delete (req, res, next) {
        const cartItem = await cartService.findById(req.params.id)
        if(cartItem.user.toString() !== req.user._id.toString() ){
            return res.status(StatusCodes.BAD_REQUEST).json(
                new ApiError(StatusCodes.BAD_REQUEST, "Cart Item not found")
            )
        }
        await cartService.deleteOne({req.params.id});
        return res.status(StatusCodes.ACCEPTED).json(
            new ApiResponse(StatusCodes.ACCEPTED, {}, "Cart item deleted", res)
        )
    }

    async update(req, res, next) {
        const cartItem = await cartService.findById(req.params.id)
        if(cartItem.user.toString() !== req.user._id.toString() ){
            return res.status(StatusCodes.BAD_REQUEST).json(
                new ApiError(StatusCodes.BAD_REQUEST, "Cart Item not found")
            )
        }
        const {quantity=1} = req.body
        let updatedCart;
        if(quantity == 0) {
            updatedCart = await cartService.deleteOne({_id:req.params.id})
        }else{
            updatedCart = await cartService.updateOne({_id:req.params.id}, {quantity:req.body.quantity}, {new:true})
        }
        return res.status(StatusCodes.ACCEPTED).json(
            new ApiResponse(StatusCodes.ACCEPTED, updatedCart, "Cart Item Updated", res)
        )
    }

    async find(req, res, next){
        const cartItems = await cartService.find({user:req.user._id}) || [];
        const cartData = {
            items: cartItems,
            totalItems: cartItems.length,
            totalPrice: cartItems.reduce((total, item) => {
                const price = item.product?.price || 0;
                const quantity = item.quantity || 0;
                return total + price * quantity;
            }, 0)
        }
        return res.status(StatusCodes.OK).json(
            new ApiResponse(StatusCodes.OK, cartData, "Cart Item fetched Successfully", res)
        )
    }    
}

module.exports = new CartController();