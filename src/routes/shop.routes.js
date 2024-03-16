import { Router } from "express";
import { loginShop, registerShop ,logoutShop, updateUsername, updatePassword, 
    updateName, refreshAccessToken, getUserProfile, resetPassword, forgotPassword, 
    sendVerificationEmail, emailVerify} from "../controllers/shop.controller.js";
import {auth, shopAuth} from "../middlewares/auth.middleware.js"

const router = Router();

router.post('/shop-register',registerShop);
router.post('/login-shop',loginShop);
router.post('/reset-password',resetPassword);
router.post('/forget-passowrd',forgotPassword);
router.post('/verification-email',sendVerificationEmail);
router.post('/verify-email',emailVerify);

//secure routes
router.post('/logout',shopAuth,logoutShop);
router.post('/update-username',auth,updateUsername);
router.post('/update-password',auth,updatePassword);
router.post('/update-name',auth,updateName);
router.post('/refresh-AccessToken',refreshAccessToken);
router.post('/get-profile',auth,getUserProfile);

export const shopRouter = router;
