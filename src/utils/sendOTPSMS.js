const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendOTPSMS = async ( phoneNum, messageBody) => {
    try {
      await client.messages.create({                         
        from: TWILIO_PHONE_NUMBER,
        to: phoneNum,
        body: messageBody
        })
        
    } catch (error) {
        throw error;
        
    }
}

module.exports = sendOTPSMS;






