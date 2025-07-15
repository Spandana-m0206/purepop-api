const mongoose = require('mongoose');
const extendSchema = require('../base/BaseModel');
const bcrypt = require('bcrypt');
const {enumToArray} = require('../../utils/enumtoarray');
const { Roles } = require('../../utils/enums');
const { countryCodeRegex } = require('../../utils');

const userFields = {
    name: { type: String, required: true },
    phone: { type: Number, required: true ,min: 1000000000, max: 9999999999 },
    countryCode: { type: String, matches:countryCodeRegex, required: true },
    address: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    role: {
        type: String,
        enum: enumToArray(Roles),
        default: 'user',
    },
    otp: { type: String, default: null  },
    otpValidity: { type: Date, default: null},
    password: { type: String, required: true },
    refreshToken:{type:String, default:null},
    resetToken:{type:String,default:null},
    resetTokenExpiry:{type:Date,default:null},
    resetOTP:{type:String,default:null},
    resetOTPExpiry:{type:Date,default:null},
};

const userSchema = extendSchema( userFields);

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash('password', Number(process.env.SALTS));
        }
        if(this.email){
            this.email = this.email.trim().toLowerCase();
        }
        next();
})

userSchema.methods.isPasswordCorrect = async function ( password ){

    return await bcrypt.compare( password, this.password);

}

userSchema.methods.toJSON = function (){
    const userObject = this.toObject
    delete userObject.password;
    delete userObject.otp;
    delete userObject.otpValidity;
    delete userObject.refreshToken;
    delete userObject.resetToken;
    delete userObject.resetTokenExpiry;
    delete userObject.resetOTP;
    delete userObject.resetOTPExpiry;
    delete userObject.__v;

    return userObject;
}

userSchema.methods.generatePasswordResetToken = function (){
    this.resetToken = Math.random().toString(36).slice(-8);
    this.resetOTPExpiry = Date.now() + 3600000; //1 hour from now 
}

userSchema.methods.generatePasswordResetOTP = function (){
    this.resetOTP = Math.floor( 1000 + ( Math.random()*9000 ) ).toString();
    this.resetOTPExpiry = Date.now() + 3600000; //1 hour
}

userSchema.methods.verifyPasswordResetToken = function ( resetToken){
    return this.resetToken === resetToken && this.resetTokenExpiry > Date.now();
}

userSchema.methods.verifyPasswordResetOTP = function ( resetOTP){
    return this.resetOTP === resetOTP && this.resetOTPExpiry > Date.now();

}


const UserModel = mongoose.model("UserMOdel", userSchema);

module.exports = UserModel;
