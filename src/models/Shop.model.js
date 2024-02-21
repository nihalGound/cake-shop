import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

const shopModel = new mongoose.Schema({
    firstName:{
        type :String,
        required:[true,"first name is required"]
    },
    middleName:{
        type:String,
        required:[true,"middle name is required"]
    },
    lastName:{
        type:String,
        required:[true,"last name is required"]
    },
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username is already used"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email is already registered"],
    },
    
    shopname:{
        type:String,
        required:[true,"shop name is required"],
    },
    gstin:{
        type:String,
        required:[true,"GSTIN is required"],
        unique:[true,"GSTIN is already registered"],
    },
    location:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number], //[latitue,longitude]
            required:true,
            validate:{
                validator: function(value){
                    return Array.isArray(value) && value.length==2;
                }
            }
        }
    },
    refreshToken:{
        type:String, //jwt token
    },
    phone:{
        type:String,
        required:[true,"phone no. is required"],
        validate:{
            validator:function(number){
                return /^(\+91)?[6-9]\d{9}$/.test(number);
            },
            message:"valid phone number required",
        },
        unique:[true,"number is already registered"]
    },
    OTP: {
        otp:{
          type:Number,
        },
        messageId:{
          type:String,
        }
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    }
    
},{timestamps:true});

shopModel.pre("save",async function(next){
    if(!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
});

shopModel.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userModel.methods.verifyOtp = async function (otp,messageId) {
    if(this.OTP.otp == otp && this.OTP.messageId==messageId)
      return true;
    return false;
}

shopModel.methods.generateAcessToken = function(){
    const token = jwt.sign(
        {
            _id:this._id,
            email:this.email,
            shopname:this.shopname,
            gstin:this.gstin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    );
    return token;
}
shopModel.methods.generateRefreshToken = function(){
    const token = jwt.sign(
        {
            _id:this._id,
            email:this.email,
            shopname:this.shopname,
            gstin:this.gstin,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    );
    return token;
}

export const Shop = mongoose.model("Shop",shopModel);

