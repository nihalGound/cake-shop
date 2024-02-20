import { asyncHandler } from "./asyncHandler.js";
import { nodeMailer } from "./nodeMailer.js";
import { User } from "../models/User.model.js";
import { apiError } from "./apiError.js";
import { updateAvatar } from "../controllers/user.controller.js";

const emailSend = asyncHandler(async (email,message,otp,subject)=>{
    try {

        const isemailSend = await nodeMailer(email,otp,message,subject);

        if(!isemailSend)
            throw new apiError(500,"cannot send otp in mail","cannot mail otp");
        const updtedUser = await User.findOneAndUpdate(
            {email:email},
            {
                $set:{
                    OTP:{
                        otp:otp,
                        messageId:isemailSend.messageId
                    }
                }
            },
            {
                new:true
            }
        );
        if(!updtedUser)
            throw new apiError(404,"User not found", "Failed to update OTP");
        return {otp,isemailSend};
    } catch (error) {
        console.error(error)
        return false;
    }
});

export {
    emailSend
}