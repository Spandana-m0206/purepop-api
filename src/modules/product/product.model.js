const mongoose=require('mongoose')
const extendSchema = require('../base/BaseModel');

const productFeilds={
    title:{type:String,required:true,},
    image:[{type:mongoose.Schema.Types.ObjectId, ref:'File',required:true}],
    description:{ type:String, required:true},
    amount:{type:Number, required:true},
    totalQuantity:{type:Number, require:true}
 
}

const productSchema=extendSchema(productFeilds);

const ProductModel = mongoose.model('Product', productSchema);
module.exports= ProductModel;