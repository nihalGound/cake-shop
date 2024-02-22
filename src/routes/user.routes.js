import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {auth} from "../middlewares/auth.middleware.js";
import { addToCart, emailVerify, forgotPassword, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword, sendVerificationEmail, updateAvatar, updateName, updatePassword, updateUsername } from "../controllers/user.controller.js";

const router = Router();


router.post('/register',upload.single('avatar'),registerUser);
router.post('/login',loginUser);
router.post('/reset-password',resetPassword);
router.post('/forget-passowrd',forgotPassword);
router.post('/verification-email',sendVerificationEmail);
router.post('/verify-email',emailVerify);

//secure routes
router.post('/logout',auth,logoutUser);
router.post('/update-username',auth,updateUsername);
router.post('/update-avatar',auth,upload.single('avatar'), updateAvatar);
router.post('/update-password',auth,updatePassword);
router.post('/update-name',auth,updateName);
router.post('/refresh-AccessToken',refreshAccessToken);
router.post('/get-profile',auth,getUserProfile);
router.post('/add-to-cart/:productId',auth,addToCart);

export const userRouter = router;
