const mongoose=require('mongoose')
const extendSchema = require('../base/BaseModel');

const cartFields = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },    
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },   

}

const cartSchema=extendSchema(cartFields);

const CartModel= mongoose.model('Cart', cartSchema);

module.exports = CartModel;
