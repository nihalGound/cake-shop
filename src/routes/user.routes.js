import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {auth} from "../middlewares/auth.middleware.js";
import { loginUser, logoutUser, registerUser, updateUsername } from "../controllers/user.controller.js";

const router = Router();

router.post('/register',upload.single('avatar'),registerUser);

router.post('/login',loginUser);

//secure routes
router.post('/logout',auth,logoutUser);
router.post('/update-username',auth,updateUsername);

export {router}
