import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";


const generateAccessRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        if(!accessToken || !refreshToken){
            throw new apiError(501,"something went wrong while generatinig access and refresh token","cannot generate token");
        }
        user.refreshToken = refreshToken;
        return {accessToken,refreshToken};
    } catch (error) {
        console.error(error);
        throw new apiError(500,"something went wrong generatin token",error)
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    const {firstName,middleName,lastName,email,username,password,dob,phone} = req.body;

    if([firstName,lastName,email,username,password,dob,phone].some((field)=>field.trim()==="")){
        throw new apiError(407,"all field are neccessary");
    }
    const newDob = dob.split('-');
    const date = new Date(newDob[2],newDob[1],newDob[0]);
    const userExist = await User.findOne({
        $or:[{username},{email},{phone}],
    });

    if(userExist){
        throw new apiError(409, "user already exist");
    }

    let avatarLocalPath;
    if(req.file && req.file.path){
        avatarLocalPath = req.file.path;
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar){
        throw new apiError(500, "server error couldn't upload avatar");
    }

    const user = await User.create({
        firstName,
        middleName:middleName||"",
        lastName,
        email,
        username,
        password,
        dob:date,
        phone,
        avatar:{
            public_id:avatar.public_id || "",
            secure_url:avatar?.secure_url || ""
        }
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new apiError(500,"something went wront cannot create user");
    }

    return res.status(200).json(
        new apiResponse(200,createdUser,"user registered successfully")
    );

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
    //don't know what if old avatar couldn't delete from cloudinary

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
        new apiError(
            200,
            {
                user
            },
            "user profile fetched successfully"
        )
    )
});

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const {incomingRefreshToken} = req.body;

    if(!incomingRefreshToken)
        throw new apiError(401,"unauthorized request","refreshToken not provided");

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);
        if(!user)
            throw new apiError(402,"invalid refresh token","invalid refresh token provided");
        const {accessToken,refreshToken} = await generateAccessRefreshToken(user._id);

        const option={
            HttpOnly:true,
            secure:true
        }

        res.status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",refreshToken,option)
        .json(
            new apiResponse(
                200,
                {
                    data:user,accessToken,refreshToken
                },
                "token refreshed successfully"
            )
        )
    } catch (error) {
        throw new apiError(400,error?.message || "invalid refresh token");
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUsername,
    updatePassword,
    updateName,
    updateAvatar,
    getUserProfile,
    refreshAccessToken
}
