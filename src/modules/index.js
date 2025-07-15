const express = require("express");
const userRoutes = require("./user");
const authRoute=require('./auth');
const productRoute = require('./product');
const fileRoutes = require("./file");
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();



router.use('/v1/auth',authRoute);
router.use('/v1/users', userRoutes);
router.use('/v1/files', fileRoutes);

router.use(authMiddleware);

router.use('/v1/product', productRoute);

module.exports = router;

