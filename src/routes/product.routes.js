import { Router } from "express";
import { shopAuth} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct, getAllProduct, getProductByCategory, getProductBySubcategory } from "../controllers/product.controller.js";

const router = Router();

router.post('/add-product',upload.single('product'),shopAuth,addProduct);
router.get('/allProduct',getAllProduct);
router.get('/productbycategory/:category',getProductByCategory);
router.get('/productbycategory/:subcategory',getProductBySubcategory);

export const productRouter = router; 

