import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { loginUser, registerUser } from "../controllers/User.controller.js";

const router = Router();

router.post('/register',upload.single('avatar'),registerUser);

router.post('/login',loginUser);