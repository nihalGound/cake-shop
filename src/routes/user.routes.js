import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { login, register,logout,getProfile } from "../controllers/User.controller.js";

const router = Router();

router.post('/register',upload.single('avatar'),register);

router.post('/login',login);
router.post('/logout', logout)
router.get('/me',isLoggedIn, getProfile)
