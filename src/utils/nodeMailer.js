import nodemailer from "nodemailer";


const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "504d277968568d",
      pass: "79ec54d5dd1a31"
    }
});

const nodeMailer = async (email,otp,message,subject)=>{
    try {
        const info = await transport.sendMail({
            from:"nsnihalgound123@gmail.com",
            to:email,
            subject:subject || "email verification",
            text:`${message}, you otp is ${otp}`
        });
        return info;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export {
    nodeMailer
};