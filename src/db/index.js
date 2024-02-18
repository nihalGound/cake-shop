import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnect = async ()=>{
    try{
        const response = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("database connected !!!!");
    }catch(error){
        console.log(process.env.MONGODB_URL);
        console.log("Error in database connection ", error);
        process.exit(1);
    }
}

export default dbConnect;