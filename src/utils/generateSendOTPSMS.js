const generateOTPSMS = (name, OTP) =>{
        return `Hi ${name}, your Purepop verification code is ${OTP}. It will expire in 10 minutes.
                Please do not share this code with anyone.`;
}

module.exports = generateOTPSMS;