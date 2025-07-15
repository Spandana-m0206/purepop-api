const jwt =require("jsonwebtoken");
const UserService=require("../user/user.service");
const ApiError=require("../../utils/apiError");
const {StatusCodes}=require("http-status-codes");
const generateOTPSMS = require('../../utils/generateSendOTPSMS');
const sendOTPSMS = require('../../utils/sendOTPSMS');

exports.generateToken = (user) =>{
    try {
        const token = jwt.sign(
            {
                userId : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "12h"
            }
        )

        return token;
        
    } catch (error) {
 
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to generate token",error);

    }
}

exports.generateRefreshToken = (userId) =>{
    try {

        const refreshToken = jwt.sign({
            userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : "7d"
        })
    return refreshToken;
        
    } catch (error) {

      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to generate refresh token",error);
        
    }
}

exports.saveRefreshToken =async ( userId, token) =>{

        const user = await UserService.findById(userId);
        user.refreshToken = token;
        await user.save();

}

exports.getPayLoadFromToken = ( token) =>{
    const payLoad = jwt.verify( token, process.env.REFRESH_TOKEN_SECRET);

    if(!payLoad){
        return ;
    }
    return payLoad;
}

exports.forgetPassword = async (email) =>{
    const user = await UserService.findOne({ email: email});
    if(!user){
        throw new ApiError(StatusCodes.NOT_FOUND,"User Not Found");
    }
   user.generatePasswordResetOTP();
   await user.save();
   return user;
}

exports.sendOTPForResetPassword = async ( user) =>{
        try {
            const messageTemplate = generateOTPSMS( user?.name, user?.resetOTP);

            await sendOTPSMS( user?.phone, messageTemplate);

            
        } catch (error) {
             throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to Send OTP For Reset Password",error)
 
        }
}

exports.resetPassword = async ( email, newPassword, resetToken) =>{

        const user = await UserService.findOne({email : email});

    if(!user){
        throw new ApiError(StatusCodes.NOT_FOUND,"User Not Found")
    }
    if(!user.verifyPasswordResetToken(resetToken)){
        throw new ApiError(StatusCodes.UNAUTHORIZED,"Failed Verify Rest Token")
    }
    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetToken=undefined;
    user.resetTokenExpiry=undefined;
    user.resetOTP=undefined;
    user.resetOTPExpiry=undefined;

    await user.save();
    return user;


}