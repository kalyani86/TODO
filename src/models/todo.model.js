import mongoose from "mongoose";

const TodoSchema=new mongoose.Schema(
    {
        todoId:
        {
            type:String,
            required:true,
            unique:true
        },
        title:
        {
            type:String,
            required:true,
            lowercase:true,
            trim :true
        },
        description:
        {
            type:String,
            required:true,
            lowercase:true,
            trim :true
        },
        startDate:
        {
            type:Date,
            required:true
        },
        endDate:
        {
            type:Date,
            required:true
        },
        state:
        {
            type:String,
            enum:["start","pending","complete"],
            default:"start"
        },
        status:
        [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"status"
            }
        ]
    },
    {
        timestamps:true
    }
)

const Todo=mongoose.model("todo",TodoSchema);
export default Todo;
