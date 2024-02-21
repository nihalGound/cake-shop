import { Router } from "express";
import { loginShop, registerShop ,logoutShop, updateUsername, updatePassword, updateName, refreshAccessToken, getUserProfile} from "../controllers/shop.controller.js";
import {auth} from "../middlewares/auth.middleware.js"

const router = Router();

router.post('/shop-register',registerShop);

router.post('/login-shop',loginShop);

//secure routes
router.post('/logout',auth,logoutShop);
router.post('/update-username',auth,updateUsername);
router.post('/update-password',auth,updatePassword);
router.post('/update-name',auth,updateName);
router.post('/refresh-AccessToken',refreshAccessToken);
router.post('/get-profile',auth,getUserProfile);

export const shopRouter = router;
