import {Product} from "../models/Product.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req,res)=>{
    const {name,description,price,tags} = req.body;

    if([name,description,price].some((field)=>field.trim()===""))
        throw new apiError(401,"all field are not provided","all field are required to add prodcut");

    if(!tags || !Array.isArray(tags) || !tags.length>0)
        throw new apiError(401,"tag is not provided","tag is not provided");
    const shopname = req.shop._id;

    let imageLocalPath;
    if(req.file && req.file.path)
        imageLocalPath = req.file.path;
    if(!imageLocalPath)
        throw new apiError(401,"product image not provided","product image is not provided");
    
    const image = await uploadOnCloudinary(imageLocalPath);

    if(!image)
        throw new apiError(500,"cannot upload image on cloudinary","cannot uploda image on cloudinary");

    const product = await Product.create({
        name,
        description,
        price,
        images:image,
        tags,
        shopname:shopname
    });
    const updatedProduct = await Product.findById(product._id);
    if(!updatedProduct)
        throw new apiError(500,"cannot create product","cannot create entry of product in database");

    res.status(200)
    .json(
        new apiResponse(
            200,
            {
                data:updatedProduct
            },
            "product created successfully"
        )
    )

});
const updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        {
          new : true,
          runValidators: true,
        }
      );
  
      if (!product) {
        return next(new apiError("product with given id does not exist", 500));
      }
      res.status(200).json({
        success: true,
        message: "product updated successfully!!",
        product,
      });
    } catch (e) {
      return next(new apiError(e.message, 500));
    }
  };

  
const removeProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return next(new apiError("product with given id does not exist", 500));
      }
  
      await Product.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Product Deleted successfully!!",
        product,
        
      });
    } catch (e) {
      return next(new apiError(e.message, 500));
    }
  };
  



export {
    addProduct,
    updateProduct,
    removeProduct,
}