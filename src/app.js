import cookieParser from "cookie-parser";
import express  from "express";
import cors from "cors";
import { userRouter } from "./routes/user.routes.js";
import { shopRouter } from "./routes/shop.routes.js";
import { productRouter } from "./routes/product.routes.js";

const app = express();

app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}));
app.use(cookieParser());
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"));
app.use('/api/v1/user',userRouter);
app.use('/api/v1/shop',shopRouter);
app.use('/api/v1/product',productRouter);


export {app};
