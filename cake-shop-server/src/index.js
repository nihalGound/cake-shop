import { app } from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./db/index.js";

dotenv.config({
    path:'./.env'
})

dbConnect();

app.listen(process.env.PORT,()=>{
    console.log(`server started at port ${process.env.PORT}`);
});

