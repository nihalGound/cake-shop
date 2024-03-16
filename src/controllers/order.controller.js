import { Order } from "../models/Order.model.js";
import { User } from "../models/User.model.js";
import { Shop } from "../models/Shop.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { nodeMailer } from "../utils/nodeMailer.js";


const getOrderDetail = asyncHandler(async (req,res)=>{
    const {userId} = req.params;
    const order = await Order.aggregate([
        {
            $match:{
                "_id":userId
            }
        },
        {
            $lookup:{
                "from":"users",
                "localfield":"user",
                "foreignField":"_id",
                "as":"userDetail"
            }
        },
        {
            $lookup:{
                "from":"shops",
                "localfield":"shop",
                "foreignField":"_id",
                "as":"shopDetail"
            }
        },
        {
            $unwind:"$orderItem"
        },
        {
            $lookup:{
                "from":"products",
                "localField":"orderItem.product",
                "foreignField":"_id",
                "as":"productDetail"
            }
        },
        {
            $project:{
                "userDetail.email":1,
                "shopDetail.shopname":1,
                "productDetail.name":1,
                "productDetail.description":1,
                "productDetail.price":1,
                "productDetail.images":1,
                "orderItem.quantity":1,
                "orderStatus":1,
                "shippingAddress":1,
                "totalOrderPrice":1,
                "orderDate":1
            }
        }
    ]);

    if(!order.length)
        throw new apiError(400,"order not fetched","order not fetched");

    res.status(200)
    .json(
        new apiResponse(
            200,
            order,
            "orders fetched successfully"
        )
    )
});


const createOrder = asyncHandler(async (req,res)=>{
    const{orderItems, shippingAdress, totalOrderPrice, userId, shopId} = req.body;

    if([shippingAdress,totalOrderPrice,userId,shopId].some((field)=>field.trim()===""))
        throw new apiError(400,"all field are required","all field are not provided");
    if(!orderItems?.length)
        throw new apiError(400,"orderItem is not provided","orderItem is not provided");

    const user = await User.findById(userId);
    if(!user)
        throw new apiError(401,"user not found","user not found");
    if(!user.isEmailVerified)
        throw new apiError(401,"user email is not verififed","user email is not verified");
    const shop = await Shop.findById(shopId);
    if(!shop)
        throw new apiError(401,"shop not found","shop not found");

    const order = await Order.create({
        orderItem:orderItems,
        totalOrderPrice:totalOrderPrice,
        user:userId,
        shop:shopId,
        shippingAddress:shippingAdress
    });

    const orderExist = await Order.aggregate([
        {
            $match:{"_id":order._id}
        },
        {
            $lookup:{
                "from":"shops",
                "localfield":"shop",
                "foreignField":"_id",
                "as":"shopDetail"
            }
        },
        {
            $unwind:"$orderItem"
        },
        {
            $lookup:{
                "from":"products",
                "localField":"orderItem.product",
                "foreignField":"_id",
                "as":"productDetail"
            }
        },
        {
            $project:{
                "userDetail.email":1,
                "shopDetail.shopname":1,
                "productDetail.name":1,
                "productDetail.description":1,
                "productDetail.price":1,
                "productDetail.images":1,
                "orderItem.quantity":1,
                "orderStatus":1,
                "shippingAddress":1,
                "totalOrderPrice":1,
                "orderDate":1
            }
        }
    ]);
    if(!orderExist)
        throw new apiError(402,"order cannot created","order cannot created");
    user.cart.push(orderExist._id);
    await user.save();

    const userMessage = `you order has been created order detail are ${orderExist}`;
    const subject = "Order has been placed";
    const shopMessage = `${user.username} has been order product ${orderExist}`

    await nodeMailer(user.email,userMessage,subject);
    await nodeMailer(shop.email,shopMessage,subject);

    res.status(200)
    .json(
        new apiResponse(
            200,
            orderExist,
            "order created successfully"
        )
    )
});

const cancelOrder = asyncHandler(async (req,res)=>{
    const {orderId,username} = req.params;

    if(!orderId?.trim())
        throw new apiError(401,"orderid not found","orderId not found");

    const order = await Order.findById(orderId);
    if(!order)
        throw new apiError(401,"order not found","order not found");

    const user = await User.findById(username);
    if(!user)   
        throw new apiError(401,"user not found","user not found");

    if(user._id !==order.user)
        throw new apiError(402,"user is not valid","user is not valid");

    const shop = await Shop.findById(order.shop);

    order.orderStatus = "cancelled";
    await order.save();
    const updatedOrder = await Order.aggregate([
        {
            $match:{"_id":order._id}
        },
        {
            $lookup:{
                "from":"shops",
                "localfield":"shop",
                "foreignField":"_id",
                "as":"shopDetail"
            }
        },
        {
            $unwind:"$orderItem"
        },
        {
            $lookup:{
                "from":"products",
                "localField":"orderItem.product",
                "foreignField":"_id",
                "as":"productDetail"
            }
        },
        {
            $project:{
                "userDetail.email":1,
                "shopDetail.shopname":1,
                "productDetail.name":1,
                "productDetail.description":1,
                "productDetail.price":1,
                "productDetail.images":1,
                "orderItem.quantity":1,
                "orderStatus":1,
                "shippingAddress":1,
                "totalOrderPrice":1,
                "orderDate":1
            }
        }
    ]);
    if(updatedOrder.orderStatus!=="cancelled")
        throw new apiError(500,"order cannot cancelled","order cannot cancelled");

    const userMessage = `you order has been cancelled order detail are ${updatedOrder}`;
    const subject = "Order has been cancelled";
    const shopMessage = `${user.username} has been cancelled order ${updatedOrder}`

    await nodeMailer(user.email,userMessage,subject);
    await nodeMailer(shop.email,shopMessage,subject);

    res.status(200)
    .json(
        new apiResponse(
            200,
            updatedOrder,
            "order has been cancelled"
        )
    )

});


export {
    getOrderDetail,
    createOrder,
    cancelOrder
}