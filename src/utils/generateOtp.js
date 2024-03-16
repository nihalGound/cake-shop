import otpGenerator from "otp-generator";

const generateOtp = ()=>{
    try {
        const otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        return otp;
    } catch (error) {
        console.log(error)
        return null;
    }
}


export {
    generateOtp
}