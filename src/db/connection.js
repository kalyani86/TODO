import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB=async()=>
    {
        try{
            console.log(process.env.MONGO_DB_URL);
            const connect=await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);
          //  console.log(connect);
            console.log("DB connection sucessful");
        }
        catch(err)
        {
            console.log("error in db connection",err);
        }
    }

export default connectDB;