import { Router } from "express";
import { auth, shopAuth} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProduct, getAllProduct, getProductByCategory, getProductByPriceRange, getProductBySubcategory, removeProduct, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.post('/add-product',upload.single('product'),shopAuth,addProduct);
router.get('/allProduct',getAllProduct);
router.get('/productbycategory/:category',getProductByCategory);
router.get('/productbysubategory/:subcategory',getProductBySubcategory);
router.get('/productbyprice/:priceRange',getProductByPriceRange);

//secure routes
router.delete('/delete-product/:id',shopAuth,removeProduct);

router.put('/update-product/:id',shopAuth,updateProduct);


export const productRouter = router; 

