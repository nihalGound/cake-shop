import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";
import { generateOtp } from "../utils/generateOtp.js";
import {emailSend} from "../utils/sendMail.js";


const generateAccessRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
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

const registerUser = asyncHandler(async (req,res)=>{
    const {firstName,middleName,lastName,username,email,password,dob,phone} = req.body;

    if([firstName,lastName,username,email,password,dob,phone].some((field)=>field.trim()===""))
        throw new apiError(401,"invalid data provided","data is not provided in registeration");
    const userExist = await User.findOne({
        $or:[{username},{email},{phone}]
    });
    if(userExist)   
        throw new apiError(402,"user already exist","user already registerd");

    let avatarLocalPath;
    if(req.file && req.file.path)
        avatarLocalPath = req.file.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar)
        throw new apiError(500,"couldn't upload avatar on cloudinary","couldn't uplodad avatar on cloudinary");

    const user = await User.create({
        firstName,
        middleName,
        lastName,
        username,
        email,
        password,
        dob,
        phone,
        avatar:{
            public_id:avatar.public_id,
            secure_url:avatar.secure_url
        },
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser)
        throw  new apiError(500,"couldn't create user","couldn't create user");

    res.status(200)
    .json(
        new apiResponse(
            200,
            {
                user:createdUser
            },
            "user registered successfully"
        )
    )

});

const loginUser = asyncHandler(async (req,res)=>{
        const {username,password} = req.body;
        if(!username || !password){
            throw new apiError(401,"invalid credential","invalid username and password");
        }

    const user = await User.findOne({username});

    if(!user){
        throw new apiError(404,"user is not registered");
    }

    const validUser = await user.isPasswordCorrect(password);
    if(!validUser){
        throw new apiError(401,"incorrect password");
    }

    const {accessToken,refreshToken} = await generateAccessRefreshToken(user._id);

    const loogedUser = await User.findById(user._id).select("-password -refreshToken");

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
                user:loogedUser,accessToken
            },
            "user logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
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
            "user logged out successfully"
        )
    )

});

const updateUsername = asyncHandler(async (req,res)=>{
    const {username} = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
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

    const user = await User.findById(req.user._id);

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

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
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

const updateAvatar = asyncHandler(async (req,res)=>{
    let avatarLocalPath;
    if(req.file && req.file.path)
        avatarLocalPath = req.file.path;

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new apiError(500,"cannot upload avatar on cloudinary","error in updating avatar");
    }

    const oldAvatar = await User.findById(req.user._id).select("avatar");

    const deleteOldAvatar = await deleteFromCloudinary(oldAvatar.public_id);
    console.log(deleteOldAvatar)

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar:{
                    public_id:avatar.public_id,
                    secure_url:avatar.secure_url
                }
            }
        },
        {
            new:true
        }
    );

    if(!updatedUser)
        throw new apiError(500,"cannot update avatar","cannot update avatar in db");

    res.status(200)
    .json(
        new apiResponse(
            200,
            updatedUser,
            "avatar updated successfully"
        )
    )

});

const getUserProfile = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id).select("-passowrd -refreshToken");

    if(!user)
        throw new apiError(402,"cannot find user","cannot find user to get profile");

    res.status(200)
    .json(
        new apiResponse(
            200,
            {
               user:user 
            },
            "user profile fetched successfully"
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

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new apiError(402, "Invalid refresh token", "Invalid refresh token provided");
        }

        const { newAccessToken, newRefreshToken } = await generateAccessRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        const updatedUser = await User.findById(user._id).select("-password -refreshToken");
        
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


const sendVerificationEmail = asyncHandler(async (req, res) => {
    const {email}= req.body;

    if(!email)
        throw new apiError(401,"email is required","invalid email");
    const userExist = await User.findOne({email});
    if(!userExist)
        throw new apiError(402,"user is not registeredd","user not exxist");

    const message = "this is email for verification of email id ";
    const subject = "verification of email";
    const otp =  generateOtp();
    if(otp===null)
        throw new apiError(500,"cannot generate otp","cannot generate otp");

    const emailResponse = await emailSend(email,message,otp,subject);

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

    const user = await User.findOne({email});

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

    const user = await User.findOne({email});
    if(!user)
        throw new apiError(401,"user is not registered","unregistered user");
    const otp = generateOtp();
    const message = "this is mail for forgot password"
    const subject = "OTP for forgot password"
    const isEmailSend = await emailSend(email,message,otp,subject);
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

    const user = await User.findOne({email});

    if(!user)
        throw new apiError(401,"invalid user","invalid user");

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
    registerUser,
    loginUser,
    logoutUser,
    updateUsername,
    updatePassword,
    updateName,
    updateAvatar,
    getUserProfile,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    emailVerify,
    sendVerificationEmail
}
