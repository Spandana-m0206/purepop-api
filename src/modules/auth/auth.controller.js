//create a token
// create a refresh token 
// password creation
//reset password 
const { StatusCodes } = require("http-status-codes");
const  ApiError  = require("../../utils/apiError");
const AuthService = require("./auth.service");
const UserService = require("../user/user.service");
const ApiResponse  = require("../../utils/apiResponse");

exports.login =async (req,res)=>{
try {
        const { phone, password} = req.body;
    
        if(!phone || !password){
            return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST,"Please Fill The Required Fields","Please Fill The Required Fields"))
        }
        const user = await UserService.findOne({ phone : phone});
    
        if( !user || !await user.isPasswordCorrect( password) ){
            return res.status(StatusCodes.UNAUTHORIZED).json(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Credentials", "Invalid Credentials"))
        }
        const accessToken = AuthService.generateToken( user );
        const refreshToken = AuthService.generateRefreshToken( user._id );
        await AuthService.saveRefreshToken(user._id,refreshToken);
        // delete user.password
    return new ApiResponse( StatusCodes.OK, {
        accessToken,
        refreshToken
        
    }, "User Logged In Successfully", res);        

      
     
} catch (error) {
    
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Something Went Wrong",error))

    
}  
}

exports.refreshAccessToken = async (req, res) =>{
try {
        const {refreshToken} = req.body;
        const {userId} = AuthService.getPayLoadFromToken(refreshToken);
        const user = await UserService.findById(userId);
        if(user.refreshToken!==refreshToken){
            return res.status(StatusCodes.UNAUTHORIZED).json(new ApiError(StatusCodes.NOT_FOUND,"Invalid Token","Invalid Token"));
        }
        const newAccessToken= AuthService.generateToken(user);
        const newRefreshToken= AuthService.generateRefreshToken(userId,refreshToken); 
     
         return new ApiResponse(StatusCodes.ACCEPTED,{accessToken:newAccessToken,refreshToken:newRefreshToken},"Succesfuly Token Generated", res);
} catch (error) {

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Something Went Wrong",error));
    
}
}
exports.forgotPassword=async (req,res)=>{
    try {
        const {email}=req.body
        if(!email){
            return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST,"Email Not Found","Email Not Found"))
        }
        const user=await AuthService.forgetPassword(email.trim().toLowerCase())
        await AuthService.sendOTPForResetPassword(user)

        return new ApiResponse(StatusCodes.ACCEPTED,{}, `Reset Password Mail send to ${email?.toLowerCase()}`,res)
       
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Something Went Wrong",error))

    }
}
exports.verifyResetOTP =async (req, res) =>{
    try {
             const {phone, otp} = req.body;
      if(!otp){
        return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST,"Enter OTP","OTP Is Required"))
      }
      if(!email){
        return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST,"Enter Email","Email Is Required"))
      }
      const user = await UserService.findOne({ phone: phone});
      if(!user){
        return res.status(StatusCodes.NOT_FOUND).json(new ApiError(StatusCodes.NOT_FOUND,"User Not Found","User Not Found"))
  
      }
      if(!await user.verifyPasswordResetOTP(otp)){
        return res.status(StatusCodes.BAD_REQUEST).json(new ApiError(StatusCodes.BAD_REQUEST,"Wrong OTP","Wrong OTP"))

      }    
      user.generatePasswordResetToken();
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();
      
       return new ApiResponse(StatusCodes.ACCEPTED, {resetToken:user.resetToken},"Successfully Verified",res);
     
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Something Went Wrong",error))
        
    }
}

exports.resetPassword=async (req,res)=>{
    try {
        const {email,password,resetPasswordToken}=req.body
        if(!email ||!password ||!resetPasswordToken){
            return res.status(400).json(new ApiError(StatusCodes.BAD_REQUEST, "Please fill required fields"));
          }
          const user=await AuthService.resetPassword(email.trim().toLowerCase(),password,resetPasswordToken);  
        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token or email"));
          }
          
          return new ApiResponse(StatusCodes.ACCEPTED,{}, "Password reset successfully",res)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Something Went Wrong",error))
    }
}

