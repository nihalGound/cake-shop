import {User} from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req,res)=>{
    //write register user controller

});

const loginUser = asyncHandler(async(req,res)=>{
    //write login user controller

});

export {registerUser,loginUser};