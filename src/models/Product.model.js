import mongoose from "mongoose";

const productModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"product name is required"],
    },
    description:{
        type:String,
        required:[true,"product description is required"],
    },
    price:{
        type:Number,
        required:true,
    },
    images:[
        {
            type:String,//cloudinary url
        }
    ],
    rating:{
        type:Number,
        defualt :0
    },
    shopname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
    },
    isAvailable:{
        types:Boolean,
        default:false,
    },
},{timestamps:true});

export const Product = mongoose.model("Product",productModel);