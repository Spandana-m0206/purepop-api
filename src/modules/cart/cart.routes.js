const express =require('express');
const CartController =require('./cart.controller');
const authorize = require('../../middlewares/casbin.middleware'); // Casbin middleware
const cartController = require('./cart.controller');
const router=express.Router();

router.post('/',authorize('cart','manage'),CartController.create.bind(CartController));
router.get('/',authorize('cart','view'),cartController.find.bind(CartController));
router.put('/:id',authorize('cart','manage'),CartController.update.bind(CartController));
router.delete('/:id',authorize('cart','manage'),CartController.delete.bind(CartController));

module.exports=router;