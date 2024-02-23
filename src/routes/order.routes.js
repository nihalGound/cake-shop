import { Router } from "express";
import {auth} from "../middlewares/auth.middleware.js"
import { cancelOrder, createOrder, getAllOlders, getOrderDetail } from "../controllers/order.controller";

const router = Router();

//secure routes

router.post('/create-order',auth,createOrder);
router.get('/cancel-ordr/:orderId/:username',auth,cancelOrder);
router.get('orderDetail/:orderId',auth,getOrderDetail);

export const orderRouter = router;