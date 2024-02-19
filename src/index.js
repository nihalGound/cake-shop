import { app } from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./db/index.js";
const PORT = process.env.PORT || 5000


dotenv.config({
    path:'./.env'
})

dbConnect();

app.listen(process.env.PORT,async ()=>{
    await dbConnect();
    console.log(`server started at port ${process.env.PORT}`);
});

