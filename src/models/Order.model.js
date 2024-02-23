import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
});

const orderModel = new mongoose.Schema({
    orderItem:[{
        type:orderItemSchema,
        required:true,
    }],
    orderStatus:{
        type:String,
        default:"Pending",
        required:true
    },
    shippingAddress:{
        type:String,
        required:true
    },
    totalOrderPrice:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true,
    },
    orderDate:{
        type:Date,
        default:new Date()
    }

},{timestamps:true});

export const Order = mongoose.model("Order",orderModel);