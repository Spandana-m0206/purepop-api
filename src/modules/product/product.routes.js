const express =require('express');
const ProductController=require('./product.controller');
const upload=require('../file/file.storage');
const authorize = require('../../middlewares/casbin.middleware'); // Casbin middleware
const router=express.Router();

router.post('/upload-image/:id',upload.array('file'),authorize('product','manage'),ProductController.uploadImage.bind(ProductController));
router.post('/',authorize('product','manage'),upload.array('file'),ProductController.create.bind(ProductController));
router.get('/',authorize('product','view'),ProductController.find.bind(ProductController));
router.get('/:id',authorize('product','view'),ProductController.findOne.bind(ProductController));
router.put('/:id',authorize('product','manage'),ProductController.update.bind(ProductController));
router.delete('/:id',authorize('product','manage'),ProductController.delete.bind(ProductController));
router.delete('/delete-image/:id/:imageId',authorize('product','manage'),ProductController.deleteImage.bind(ProductController));

module.exports=router;