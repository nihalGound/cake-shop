import {Shop} from "../models/Shop.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { generateOtp } from "../utils/generateOtp.js";
import { shopEmailSend } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

const generateAccessRefreshToken = async(userId)=>{
    try {
        const user = await Shop.findById(userId);
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();
        if(!accessToken || !refreshToken){
            throw new apiError(501,"something went wrong while generatinig access and refresh token","cannot generate token");
        }
        user.refreshToken = refreshToken;
        user.save();
        return {accessToken,refreshToken};
    } catch (error) {
        console.error(error);
        throw new apiError(500,"something went wrong generatin token",error)
    }
}

const registerShop = asyncHandler(async (req,res)=>{
    const {firstName,middleName,lastName,username,password,email,shopname,gstin,location,phone} = req.body;

    if([firstName,middleName,lastName,username,password,email,shopname,gstin,phone].some((field)=>field.trim()===""))
        throw new apiError(401,"all field are neccessary","insufficient data provided");
    
    if (!location || !location.type || !location.coordinates || location.type !== 'Point' || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        throw new apiError(400,"invalid location data","invalid location data");
    }  
    
    const userExist = await Shop.findOne({
        $or:[{email},{phone},{username},{gstin}]
    });

    if(userExist)
        throw new apiError(401,"shop already exist","shop already registered");

    const user = await Shop.create({
        firstName,
        middleName,
        lastName,
        username,
        password,
        email,
        shopname,
        gstin,
        phone,
        location:{
            type:'Point',
            coordinates:location.coordinates
        }
    });

    const updatedUser = await Shop.findById(user._id).select("-passowrd -refreshToken");

    if(!updatedUser)
        throw new apiError(500,"couldn't created shop user","couldn't created shop in database");

    res.status(200)
    .json(
        new apiResponse(
            200,
            {
                user:updatedUser
            },
            "shop registered successfully"
        )
    )
});

const loginShop = asyncHandler(async (req,res)=>{
    const {username,password} = req.body;

    if([username,password].some((field)=>field.trim()===""))
        throw new apiError(400,"invalid data","all field are required");
    const userExist = await Shop.findOne({username});
    if(!userExist)  
        throw new apiError(400,"user not registerd","shop user is not registered");

    const isValidPassword = await userExist.isPasswordCorrect(password);
    if(!isValidPassword)
        throw new apiError(401,"invalid password","invalid passowrd provided in shop");

    const {accessToken,refreshToken} = await generateAccessRefreshToken(userExist._id);
    const loggedInUser = await Shop.findById(userExist._id).select("-password -refreshToken");

    const option = {
        HttpOnly:true,
        secure:true,
    }

    res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new apiResponse(
            200,
            {
                user:loggedInUser
            },
            "shop user logged in successfully"
        )
    )
    
});

const logoutShop = asyncHandler(async (req,res)=>{
    await Shop.findByIdAndUpdate(
        req.shop._id,
        {
            $set:{
                refreshToken:undefined,
            }
        },
        {
            new:true
        }
    )
    
    const option = {
        HttpOnly:true,
        secure:true,
    }

    res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(
        new apiResponse(
            200,
            {},
            "shop user logged out successfully"
        )
    )
});

const updateUsername = asyncHandler(async (req,res)=>{
    const {username} = req.body;
    const updatedUser = await Shop.findByIdAndUpdate(
        req.shop._id,
        {
            $set:{
                username,
            }
        },
        {
            new:true,
        }
    );

    if(!updatedUser)
        throw new apiError(500,"cannot update username","cannot upadate username in db");

    res.status(200)
    .json(
        new apiResponse(
            200,
            updatedUser,
            "username changed successfully"
        )
    )
});

const updatePassword = asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new apiError(401,"both old passwor and new password required","both old password and new password required");
    }
    if(oldPassword===newPassword){
        throw new apiError(401,"new password should not match old password","new password same as old password")
    }

    const user = await Shop.findById(req.shop._id);

    const validUser = await user.isPasswordCorrect(oldPassword);
    if(!validUser){
        throw new apiError(401,"invalid old password","invalid old password");
    }

    user.password = newPassword;
    await user.save({validationBeforeSave:true})

    return res
    .status(200)
    .json(new apiResponse(
        200,
        {},
        "password changed successfully"
    ))
});

const updateName = asyncHandler(async (req,res)=>{
    const {firstName,middleName,lastName} = req.body;
    if(!firstName || !lastName){
        throw new apiError(400,"all field are required","insufficent data provided for updating name");
    }
    if([firstName,lastName].some((field)=>field.trim()==="")){
        throw new apiError(401,"invalid name","invalid firstname or lastname");
    }

    const updatedUser = await Shop.findByIdAndUpdate(
        req.shop._id,
        {
            $set:{
                firstName:firstName,
                middleName:middleName||"",
                lastName:lastName
            }
        },
        {
            new:true
        }
    );
    
    if(!updatedUser)
        throw new apiError(500,"cannot update name","cannot update name in db");
        
    res.status(200)
    .json(
        new apiResponse(
            200,
            updatedUser,
            "username updated successfully"
        )
    )
});

const getUserProfile = asyncHandler(async (req,res)=>{
    const user = await Shop.findById(req.shop._id).select("-passowrd -refreshToken");

    if(!user)
        throw new apiError(402,"cannot find user","cannot find user to get profile");

    res.status(200)
    .json(
        new apiResponse(
            200,
            {
               user:user 
            },
            "Shop profile fetched successfully"
        )
    )
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies; 

    if (!refreshToken) {
        throw new apiError(401, "Unauthorized request", "Refresh token not provided");
    }

    try {
        const decodedToken =jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        if (!decodedToken) {
            throw new apiError(402, "Invalid refresh token", "Invalid refresh token");
        }

        const user = await Shop.findById(decodedToken._id);

        if (!user) {
            throw new apiError(402, "Invalid refresh token", "Invalid refresh token provided");
        }

        const { newAccessToken, newRefreshToken } = await generateAccessRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        const updatedUser = await Shop.findById(user._id).select("-password -refreshToken");
        
        res.status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        data: updatedUser,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    },
                    "Token refreshed successfully"
                )
            );
    } catch (error) {
        throw new apiError(500, "Internal Server Error", error.message);
    }
});


const sendVerificationEmail = asyncHandler(async (req,res)=>{
    const {email}= req.body;

    if(!email)
        throw new apiError(401,"email is required","invalid email");
    const userExist = await Shop.findOne({email});
    if(!userExist)
        throw new apiError(402,"user is not registeredd","user not exxist");

    const message = "this is email for verification of email id ";
    const subject = "verification of email";
    const otp =  generateOtp();
    if(otp===null)
        throw new apiError(500,"cannot generate otp","cannot generate otp");

    const emailResponse = await shopEmailSend(email,message,otp,subject);

    if(emailResponse===null)
        throw new apiError(500,"cannot send email","cannot send email")

    res.status(200)
    .json(
        new apiResponse(
            200,
            {
                data:otp,emailResponse
            },
            "email send successfully"
        )
    )
});

const emailVerify = asyncHandler(async (req,res)=>{
    const {otp,messageId,email}=req.body;

    const user = await Shop.findOne({email});

    if(!user)
        throw new apiError(401,"invalid user","invalid user");

    const isOtpCorrect = await user.verifyOtp(otp,messageId);

    if(!isOtpCorrect)
        throw new apiError(401,"wrong opt","invalid otp send");
    user.isEmailVerified = true;
    await user.save();
    res.status(200)
    .json(
        new apiResponse(
            200,
            {},
            "email verified successfully"
        )
    )
});

const forgotPassword = asyncHandler(async (req,res)=>{
    const {email}=req.body;

    if(!email)
        throw new apiError(401,"email is required","email not found");

    const user = await Shop.findOne({email});
    if(!user)
        throw new apiError(401,"shop is not registered","unregistered user");
    const otp = generateOtp();
    const message = "this is mail for forgot password"
    const subject = "OTP for forgot password"
    const isEmailSend = await shopEmailSend(email,message,otp,subject);
    if(isEmailSend===null)
        throw new apiError(500,"cannot send email","cannot send email");
    
    res.status(200)
    .json(new apiResponse(
        200,
        {
            data:otp,isEmailSend
        },
        "email send successfully"
    )) 
});

const resetPassword = asyncHandler(async (req,res)=>{
    const {otp,messageId,email,password}=req.body;

    const user = await Shop.findOne({email});

    if(!user)
        throw new apiError(401,"invalid shop user","invalid user");

    const isOtpCorrect = await user.verifyOtp(otp,messageId);

    if(!isOtpCorrect)
        throw new apiError(401,"wrong opt","invalid otp send");

    user.password = password;
    await user.save();

    res.status(200)
    .json(
        new apiResponse(
            200,
            {},
            "password changed successfully"
        )
    )

});

export {
    registerShop,
    loginShop,
    logoutShop,
    updateUsername,
    updatePassword,
    updateName,
    getUserProfile,
    refreshAccessToken,
    sendVerificationEmail,
    emailVerify,
    forgotPassword,
    resetPassword
};