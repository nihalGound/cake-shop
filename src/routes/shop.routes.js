import { Router } from "express";
import { loginShop, registerShop } from "../controllers/shop.controller";

const router = Router();

router.post('/shop-register',registerShop);

router.post('/login-shop',loginShop);