import {Product} from "../models/Product.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req,res)=>{
    const {name,description,price,tags,category,subcategory} = req.body;

    if([name,description,price,category,subcategory].some((field)=>field.trim()===""))
        throw new apiError(401,"all field are not provided","all field are required to add prodcut");

    if(!tags || !Array.isArray(tags) || !tags.length>0)
        throw new apiError(401,"tag is not provided","tag is not provided");
    const isVerified = req.shop.isEmailVerified;
    if(!isVerified)
        throw new apiError(403,"email is not verified","email is not verified");
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
        images:{
            public_id:image.public_id,
            secure_url:image.secure_url
        },
        tags,
        shopname:shopname,
        category,
        subcategory
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

const updateProduct = asyncHandler(async (req, res, next) => {
      const {_id} = req.shop._id;
      const { id } = req.params;
      if(!id?.trim())
      throw new apiError(401,"product id is not provided","product id is not provided")

        const isAdmin = await Product.findById(id).select("shop");
        if(isAdmin!==_id)
            throw new apiError(405,"admin not matched","admin not matched");
  
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
});

const removeProduct = asyncHandler(async (req, res, next) => {
        const {_id} = req.shop._id;
        const { id } = req.params;
        if(!id?.trim())
            throw new apiError(401,"product id is not provided","product id is not provided")

      const isAdmin = await Product.findById(id).select("shop");
      if(isAdmin!==_id)
          throw new apiError(405,"admin not matched","admin not matched");

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
});

const getAllProduct = asyncHandler(async (_,res)=>{
    const product = await Product.aggregate([
       {
            $lookup:{
                "from":"shops",
                "localField":"shop",
                "foreignField":"_id",
                "as":"shop_owner"
            }
       },
       {
            $project:{
                "name":1,
                "description":1,
                "price":1,
                "shop_owner.shopname":1,
                "shop_owner.gstin": 1,
                "images":1,
                "tags":1,
                "category":1,
                "subcategory":1,
                "isAvailable":1,
                "rating":1
            }
       }
    ]);
    if(!product.length)
        throw new apiError(500,"cannot fetched products","cannot fetched prodcuts");
    res.status(200)
    .json(new apiResponse(
        200,
        product,
        "product fetched succesfully"
    ))
});

const getProductByCategory = asyncHandler(async (req,res)=>{
    const {category }= req.params;
    if(!category?.trim())
        throw new apiError(401,"category not provided","category not provided");

    const product = await Product.aggregate([
        {
            $match:{
                "category":category
            }
        },
        {
            $lookup:{
                "from":"shops",
                "localField":"shop",
                "foreignField":"_id",
                "as":"shop_owner"
            }
        },
        {
            $project:{
                "name":1,
                "description":1,
                "price":1,
                "shop_owner.shopname":1,
                "shop_owner.gstin": 1,
                "images":1,
                "tags":1,
                "category":1,
                "subcategory":1,
                "isAvailable":1,
                "rating":1
            }
        }
    ]);
    if(!product.length)
        throw new apiError(500,"couldnot fetched product by category","couldnot fetched product by category")

    res.status(200)
    .json(
        new apiResponse(
            200,
            product,
            "product fetched successfully"
        )
    )
});

const getProductBySubcategory = asyncHandler(async (req,res)=>{
    const {subcategory} = req.params;
    if(!subcategory?.trim())
        throw new apiError(401,"subcategory not found","subcategory not found")

    const product = await Product.aggregate([
        {
            $match:{
                "subcategory":subcategory
            }
        },
        {
            $lookup:{
                "from":"shops",
                "localField":"shop",
                "foreignField":"_id",
                "as":"shop_owner"
            }
       },
       {
            $project:{
                "name":1,
                "description":1,
                "price":1,
                "shop_owner.shopname":1,
                "shop_owner.gstin": 1,
                "images":1,
                "tags":1,
                "category":1,
                "subcategory":1,
                "isAvailable":1,
                "rating":1
            }
       }
    ]);
    if(!product.length)
        throw new apiError(500,"product cannot fetched","product cannot fetched")

    res.status(200)
    .json(
        new apiResponse(
            200,
            product,
            "product fetched successfully"
        )
    )
});

const getProductByPriceRange = asyncHandler(async (req,res)=>{
    const {priceRange} = req.params;//req.params comes in string
    if(!priceRange?.trim())
        throw new apiError(401,"price range not sent","price range not sent");
    const [minPrice,maxPrice] = priceRange.split('-');
    const realMinPrice = parseFloat(minPrice);//convert string to number
    const realMaxPrice = parseFloat(maxPrice);//convert string to number
    const product = await Product.aggregate([
        {
            $match:{
                "price":{$gte:realMinPrice, $lte:realMaxPrice}
            }
        },
        {
            $lookup:{
                "from":"shops",
                "localField":"shop",
                "foreignField":"_id",
                "as":"shop_owner"
            }
       },
       {
            $project:{
                "name":1,
                "description":1,
                "price":1,
                "shop_owner.shopname":1,
                "shop_owner.gstin": 1,
                "images":1,
                "tags":1,
                "category":1,
                "subcategory":1,
                "isAvailable":1,
                "rating":1
            }
       }

    ]);

    if(!product.length)
        throw new apiError(500,"cannot fetched any product","cannot fetche any prodcut");

    res.status(200)
    .json(
        new apiResponse(
            200,
            product,
            "product fetched successfully"
        )
    )

});

export {
    addProduct,
    getAllProduct,
    getProductByCategory,
    getProductBySubcategory,
    updateProduct,
    removeProduct,
    getProductByPriceRange
}