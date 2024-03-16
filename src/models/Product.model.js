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
    images:{
            public_id:{
                type:String,
            },
            secure_url:{
                type:String
            }
    },
    rating:{
        type:Number,
        default :0
    },
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true,
    },
    tags:{
        type:[String],
        required:true,
    },
    category: {
        type:String,
        enum:["birthday","party","marriage"]
    },
    subcategory: {
        type:String,
        enum:["chocolate","strawberry","orange","pineapple"]
    }
},{timestamps:true});

export const Product = mongoose.model("Product",productModel);