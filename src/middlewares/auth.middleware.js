import jwt  from "jsonwebtoken";
import {apiError} from "../utils/apiError.js";
import {User} from "../models/User.model.js";
import {Shop} from "../models/Shop.model.js";



const auth = async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new apiError(401,"unauthorized user","accessToken not provided");
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        const shop = await Shop.findById(decodedToken._id).select("-password -refreshToken");
        if(!user){
            if(!shop){
                throw new apiError(404,"Invalid access Token","invalid access token for shop");
            }
            else{
                req.shop = shop;
                next();
            }
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new apiError(401,error?.message || "Invalid access token"));
    }
}

const shopAuth = async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new apiError(401,"unauthorized user","accessToken not provided");
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const shop = await Shop.findById(decodedToken._id).select("-password -refreshToken");
            if(!shop){
                throw new apiError(404,"Invalid access Token","invalid access token for shop");
            }
        req.shop = shop;
        next();
    } catch (error) {
        return next(new apiError(401,error?.message || "Invalid access token"));
    }
}


export{
    auth,
    shopAuth
}
