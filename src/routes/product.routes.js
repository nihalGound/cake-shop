import { Router } from "express";
import { auth, shopAuth} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct, removeProduct, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.post('/add-product',upload.single('product'),shopAuth,addProduct);

router.route('/add-product/:id')
    .put(auth,shopAuth,updateProduct)
    .delete(auth, shopAuth,removeProduct)


export const productRouter = router; 

