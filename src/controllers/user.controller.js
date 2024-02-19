import {User} from "../models/User.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/error.utils.js";




const register = async (req,res,next) =>{
    const {fullName ,email ,password } = req.body;

    if(!fullName || !email || !password){
        return next(new AppError('All fields are mandatory',400))
    }

    const userExists=  await User.findOne({email})
    if(userExists){
        return next(new AppError('Emails already exists',400))

    }
    // agr nhi hai toh create 


    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url : 'https://ui-avatars.com/api/?name=John+Doe'

        },
    })

    if(!user){
        return next(new AppError('users reqistered failed',400))
        

    }
    // TODO file upload 

    await user.save();
    user.password = undefined;

    // token genrate

    const token = await user.generateAccessToken();

    // cookies

    res.cookie('token', token, CookieOptions)
    


    res.status(201).json({
        success : true,
        message : 'USER Registered successfully',
        user,

    })



}

const login = async(req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password) {
            return next(new AppError('Email and passwoord required',401))
        }
        const user = await User.findOne({
            email
        }).select('+password');
    
        if(!user || !user.comparePassword(password)){
            return next(new AppError('Email and passwoord not match ',401))
    
    
        }
    
        const token = await user.generateAccessToken();
        user.password = undefined;
        res.cookies('token',token,CookieOptions);
        res.status(200).json({
            success: true,
            message: 'Loggd in Successfully',
            user,
        })

    }catch(e){
        return next(new AppError(e.message,500))

     
    }
    
    
}

const logout = (req,res) =>{
    try{
        
    res.cookies('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true,
        
    })

    res.status(200).jaon({
        success: true,
        message: 'Logged out Successfully',
        user,
        })
    

    }catch(e){
        return next(new AppError(e.message,500))
    }

}

const getProfile = (req,res) =>{
    try{
        const UserId = req.user.id;
        const user = User.findbyId(UserId);
    
        res.status(200).jaon({
            success: true,
            message: 'Featch profile Successfully',
            user,
            })

    }catch(e){
        return next(new AppError(e.message,500))
    }

   

    
}
export {
    register,
    login,
    logout,
    getProfile,
    
}
   