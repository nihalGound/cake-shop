import mongoose from "mongoose";

const orderStatusModel = new mongoose.Schema({
    packaged:{
        type:Boolean,
        default:false,
    },
    shipped:{
        type:Boolean,
        default:false,
    },
    delievered:{
        types:Boolean,
        default:false
    }
});

const orderModel = new mongoose.Schema({
    cake:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    quantity:{
        type:Number,
        default:1,
    },
    orderStatus:{
        type:orderStatusModel
    },
    paymentDone:{
        type:Boolean,
        default:false,
    },
    orderAmount :{
        type:Number,
        required:true,
    },    
    delieveryContact : {
        type:String,
        required:true,
        validate:{
            validator:function(number){
                return /^(\+91\)?[6,7,8,9]\d{9}$/.test(number);
            },
            message:"please enter valid number",
        },
    },
},{timestamps:true});

export const Order = mongoose.model("Order",orderModel);