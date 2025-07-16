const mongoose=require('mongoose')
const extendSchema = require('../base/BaseModel');
const {enumToArray} = require('../../utils/enumtoarray')
const {PaymentMethods, OrderStatuses} = require('../../utils/enums')

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: Number,      
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  }
});
const orderFields = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: String, 
  paymentMethod: {
    type:String,
    enum: enumToArray(PaymentMethods)
  }, 
  isPaid: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: enumToArray(OrderStatuses),
    default: OrderStatuses.PENDING
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}

const orderSchema=extendSchema(orderFields);

const OrderModel= mongoose.model('Order', orderSchema);

module.exports = OrderModel;
