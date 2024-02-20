import cookieParser from "cookie-parser";
import express  from "express";
import cors from "cors";
import { router } from "./routes/user.routes.js";

const app = express();

app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}));
app.use(cookieParser());
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"));
app.use('/api/v1/user',router);


export {app};
