import { Router } from "express";
import { shopAuth} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct } from "../controllers/product.controller.js";

const router = Router();

router.post('/add-product',upload.single('product'),shopAuth,addProduct);

export const productRouter = router; 

