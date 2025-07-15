const mongoose=require('mongoose')
const extendSchema = require('../base/BaseModel');
const ProductModel = require('../product/product.model');

const cartFeilds = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
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
          price: {
        price: Number,
        required: true
    }

    }
  ],
  totalCartValue:{
    type:Number,
    default: 0
  }
}

const cartSchema=extendSchema(cartFeilds);

const CartMOdel= mongoose.model('Cart', cartSchema);

module.exports = CartMOdel;
