import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { jwt } from "jsonwebtoken";

const userModel = new mongoose.Schema({
    firstName : {
        type:String,
        required:[true, "User's first name required"],
    },
    middleName: {
        type:String,
    },
    lastName : {
        type:String,
        required:[true, "User's last  name required"],
    },
    email : {
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already used"],
    },
    
    avatar : {
        type:String,//cloudinary url
    },
    username : {
        type:String,
        required:[true,"username is required"],
        unique:[true,"username already used"],
    },
    password : {
        type:String,
        required:[true,"password is required"]
    },
    dob : {
        type:Date,
        required:[true,"date of birth is required"]
    },
    homeAdress : {
        type:String
    },
    workAdress : {
        type:String
    },
    cart : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    orders : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"OrderPlace"
        }
    ],
    refreshToken : {
        type:String,
    },
    phone : {
        type:String,
        required:[true,"phone number is required"],
        validate:{
            validator: function(v){
                return /^(\+91\)?[6,7,8,9]\d{9}$/.test(v);
            },
            message:props=>`${props.value} is not valid number`,
        },
    },
},{timestamps:true});

userModel.pre("save",async function(next){
    if(!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
});



userModel.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
};

userModel.methods.generateAccessToken = function(){
    const token = jwt.sign(
        {
            username:this.username,
            email:this.email,
            id:this._id,
            firstName:this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}

    );
    return token;
}
userModel.methods.generateRefreshToken = function(){
    const token = jwt.sign(
        {
            username:this.username,
            email:this.email,
            id:this._id,
            firstName:this.firstName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    );
    return token;
}


export const User = mongoose.model("User",userModel)