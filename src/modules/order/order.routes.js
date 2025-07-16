const express =require('express');
const OrderController =require('./order.controller');
const authorize = require('../../middlewares/casbin.middleware'); // Casbin middleware
const router=express.Router();

router.post('/',authorize('order','manage'),OrderController.create.bind(OrderController));
router.get('/',authorize('order','view'),cartController.find.bind(OrderController));
router.get('/:id',authorize('order','view'),OrderController.update.bind(OrderController));

module.exports=router;