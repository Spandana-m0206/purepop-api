const express = require('express');
const AuthController = require('./auth.controller');
const router = express.Router();

router.post('/login',AuthController.login)
router.post('/refresh-access-token',AuthController.refreshAccessToken)
router.post('/forgot-password',AuthController.forgotPassword)
router.post('/verify-otp',AuthController.verifyResetOTP)
router.post('/reset-password',AuthController.resetPassword)

module.exports=router;