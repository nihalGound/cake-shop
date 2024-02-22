import { Router } from "express";
import { auth, shopAuth} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct, getAllProduct, getProductByCategory, getProductBySubcategory, updateProduct, removeProduct } from "../controllers/product.controller.js";

const router = Router();

router.post('/add-product',upload.single('product'),shopAuth,addProduct);
router.get('/allProduct',getAllProduct);
router.get('/productbycategory/:category',getProductByCategory);
router.get('/productbycategory/:subcategory',getProductBySubcategory);

//secure routes
router.delete('/delete-product',shopAuth,removeProduct);

router.put('/update-product/:id',shopAuth,updateProduct);


export const productRouter = router; 

