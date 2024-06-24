import mongoose from "mongoose";

const statusSchema=new mongoose.Schema(
    {
        date:
        {
            type:Date,
            required:true
        },
        work:
        {
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Status=mongoose.model("status",statusSchema);
export default Status;