import { nodeMailer } from "./nodeMailer.js";
import { User } from "../models/User.model.js";
import { apiError } from "./apiError.js";
import { Shop } from "../models/Shop.model.js";

const emailSend = async (email, message, otp, subject) => {
    try {
        const mailResponse = await nodeMailer(email,otp,message,subject);
        if(mailResponse===null)
            throw new apiError(500,"cannot send mail","error in sending mail");
        const updatedUser = await User.findOneAndUpdate(
            {email:email},
            {
                $set:{
                    OTP:{
                        otp:otp,
                        messageId:mailResponse.messageId
                    }
                }
            },
            {new:true}
        );
    
        if(!updatedUser)
            throw new apiError(500,"cannot update otp in database","error while updating opt in db");
    
        return mailResponse;
    } catch (error) {
        return null;
    }
}

const shopEmailSend = async (email,message,otp,subject)=>{
    try {
        const mailResponse = await nodeMailer(email,otp,message,subject);
        if(mailResponse===null)
            throw new apiError(500,"cannot send mail","error in sending mail");
        const updatedUser = await Shop.findOneAndUpdate(
            {email:email},
            {
                $set:{
                    OTP:{
                        otp:otp,
                        messageId:mailResponse.messageId
                    }
                }
            },
            {new:true}
        );
    
        if(!updatedUser)
            throw new apiError(500,"cannot update otp in database","error while updating opt in db");
    
        return mailResponse;
    } catch (error) {
        return null;
    }
}

export {
    emailSend,
    shopEmailSend
}