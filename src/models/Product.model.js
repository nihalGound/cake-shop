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
            pubic_id:{
                type:String,
            },
            secure_url:{
                type:String
            }
        }
    ],
    rating:{
        type:Number,
        default :0
    },
    shopname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:false,
    },
    tags:{
        type:[String],
        required:true,
    }
},{timestamps:true});

export const Product = mongoose.model("Product",productModel);