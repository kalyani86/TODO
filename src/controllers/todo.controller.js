import Todo from "../models/todo.model.js";
import Status from "../models/status.model.js";
import User from "../models/user.model.js";

const addTodo=async(req,res)=>
    {
        try{
            const {todoId,title,description,startDate,endDate}=req.body;
            console.log(title,description,startDate,endDate);
            if(!title || !description || !startDate || !endDate || !todoId)
                {
                    res.status(404).send("all fields required");
                    return;
                }
            const data=await Todo.findOne({todoId});
            console.log(data);
            if(data)
                {
                    res.send("todo exist with this to do id");
                    return;
                }
            const todo=await Todo.create(
                {
                    todoId,
                    title,
                    description,
                    startDate,
                    endDate
                }
            )
            console.log(todo);
            if(!todo)
                {
                    res.status(400).send("failed to add to do");
                    return;
                }
            res.status(200).send("todo added");

        }catch(err)
        {
            console.log("error in adding todo",err);
            res.status(500).send("Internal server error");
        }
    }

const deleteTodo=async(req,res)=>
    {
        try {
            const {todoId}=req.body;
            console.log(todoId);
            if(!todoId)
                {
                    res.status(404).send("todo not found");
                    return;
                }

            const todo=await Todo.findOne({todoId});
            if(!todo)
                {
                    res.status(404).send("todo not found");
                    return;
                }
            await Todo.findOneAndDelete({todoId});
            res.status(200).send("todo deleted successfully");
        } catch (error) {
            console.log("Error in deleting to do");
        }
    }

const addStatus=async(req,res)=>
    {
        try{
            const {todoId,date,work}=req.body;
            console.log(req.body);
            if(!date || !work || !todoId)
                {
                    res.status(404).send("all fields required");
                    return;
                }
            
            const todo=await Todo.findOne({todoId});
            if(!todo)
                {
                    res.status(404).send("todo does not exist");
                    return ;
                }
            
            const status=await Status.create({
                date,
                work
            })

            const statusAdded=await Todo.findOneAndUpdate({todoId},{$push:{status:status._id}});
            console.log(statusAdded);
            if(!statusAdded)
                {
                    res.status(404).send("status not added");
                    return;
                }
            res.status(200).send("status added successfully");
            return;

        }catch(err)
        {
            console.log("error in ",err);
            res.status(500).send("internal server error");
        }

    }

const getTodo=async(req,res)=>
    {
        try {
            const data=await Todo.find();
            console.log(data);
            res.status(200).json({"message":"All data of todo","todo":data});
        } catch (error) {
            console.log("error to get");
            res.status(500).send("internal server error");
        }
    }
const getTodoCount=async(req,res)=>
    {
        try{
            const data=await Todo.find();
            console.log(data.length);
            res.status(200).json({"message":"All data of todo","count":data.length});
        }catch(err)
        {
            console.log("error to get");
            res.status(500).send("internal server error");
        }
    }
export {addTodo,deleteTodo,addStatus,getTodo,getTodoCount}