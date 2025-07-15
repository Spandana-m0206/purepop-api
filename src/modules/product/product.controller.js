const BaseController=require('../base/BaseController');
const ApiResponse=require('../../utils/apiResponse');
const ApiError=require('../../utils/apiError');
const {StatusCodes}=require('http-status-codes');
const fileService=require('../file/file.service');
const ProductService = require('./product.service');

class ProductController extends BaseController{

    constructor(){
        super(ProductService, "Product");
    }

    // create product
       async create(req,res,next){
        try {
            const productData=req.body
            if(!productData.title || !productData.image || !productData.description || !productData.amount){
                return next(new ApiError(StatusCodes.BAD_REQUEST,'Required Fields'))
            }
            productData.createdBy=req.user.userId

            if(req.files?.length){
                productData.image=[]
                for(const file of req.files){
                    const attachment =await fileService.create({
                        filename:file.originalname,
                        type:file.mimetype,
                        size:file.size,
                        uploadedBy:req.user.userId,
                    });
                    productData.image.push(attachment._id)
                }
            }
            const product=await this.service.create()
            return new ApiResponse(res,StatusCodes.OK,{product},"Service Area Created",res);

        } catch (error) {
            return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something Went Wrong'));

        }
    }  
    async uploadImage(req,res,next){
        try {
          const {userId}=req.user
          const {id}=req.params

          if(!Array.isArray(req.files) || req.files.length===0){
            return next(new ApiError(StatusCodes.BAD_REQUEST, 'NO Images Uploaded'));
          }
          const Product=await this.service.findById(id)
          if(!Product){
            return next(new ApiError(StatusCodes.NOT_FOUND, 'ServiceArea not found'));
          }
          //check for authorization

          const uploadedImages=[];
          
            for(const file of req.files){
              const attachment =await fileService.create({
               filename:file.originalname,
               type:file.mimetype,
               size:file.size,
               uploadedBy:req.user.userId,             
              });
  
               uploadedImages.push(attachment._id)
              }
              Product.image=Product.image.concat(uploadedImages);
              await Product.save();
  
           return new ApiResponse(res,StatusCodes.OK,"Images Uploaded",{serviceArea})
  
          
        } catch (error) {
          logger.error(error);
          return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something Went Wrong'));
  
        }
      }
          async deleteImage(req,res,next){
        try {
            const {id,imageId}=req.params
            const {userId}=req.user
      
            if(!imageId){
              return next(new ApiError(StatusCodes.BAD_REQUEST, 'Image Id Is Required'));
            }
      
            const serviceArea=await this.service.findById(id);
            if(!serviceArea){
              return next(new ApiError(StatusCodes.NOT_FOUND, 'serviceArea not found'));
            }
            if (!serviceArea.image.map(fileId=>fileId.toString()).includes(imageId)) {
              return next(new ApiError(StatusCodes.NOT_FOUND, 'Image not found in serviceArea '));
            }
          // Fetch image details to check ownership
          const imageDetails = await fileService.findOne({_id:imageId});
          if (!imageDetails) {
            return next(new ApiError(StatusCodes.NOT_FOUND, 'Image not found in storage'));
           }
      
          // Ensure only the owner can delete
          if (imageDetails.uploadedBy.toString() !== userId) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You Are Not Authorised To Delete The Image'));
           }
          await this.service.findOneAndUpdate({_id:id}, {
            $pull: {
                image: { _id: imageId }
              }
            
           });
          
                  // Delete from GridFS
          await fileService.deleteOne({_id:imageId});
          return new ApiResponse(res,StatusCodes.OK,"Image Deleted",{serviceArea})
         
         } catch (error) {
          logger.error(error);
          return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something Went Wrong'));      
         }
    
        }      
}

module.exports = new ProductController();