import Todo from "../models/todo.model.js";
import Status from "../models/status.model.js";
import User from "../models/user.model.js";
import { response } from "express";

const addTodo=async(req,res)=>
    {
        try{
            const {todoId,title,description,startDate,endDate}=req.body;
            const {username}=req.user;
            console.log(title,description,startDate,endDate);
            if(!title || !description || !startDate || !endDate || !todoId)
                {
                    res.status(404).send("all fields required");
                    return;
                }
            
            if(!username)
                {
                    res.status(400).send("Invalid user");
                    return ;
                }

               
                const user=await User.findOne({username});
                if(!user)
                {
                    res.status(400).send("user not found");
                    return;
                }
                
                const data=await Todo.aggregate([
                    {
                        $match:
                        {
                            username:username
                        }
                    },
                    {
                        $match:
                        {
                            todoId:todoId
                        }
                    }
                ])
            if(data.length!==0)
            {
                res.status(400).send("todo already exist");
                return;
            }
                
               

            const todo=await Todo.create(
                {
                    todoId,
                    username,
                    title,
                    description,
                    startDate,
                    endDate
                }
            )
           // console.log(todo);
            if(!todo)
                {
                    res.status(400).send("failed to add to do");
                    return;
                }

                
           const user1=await User.findOneAndUpdate({username},{$addToSet:{todo:todo._id}});
           //console.log(user1);
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
            const {username}=req.user;
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

            if(!username)
            {
                res.send("username not defined");
                return;
            }

            const user=await User.findOne({username});
            if(!user)
            {
                res.status(400).send("user not exist");
                return;
            }

            await User.findOneAndUpdate({username},{$pull:{todo:todo._id}});
            res.status(200).send("todo deleted successfully");
        } catch (error) {
            console.log("Error in deleting to do",error);
        }
    }

const addStatus=async(req,res)=>
    {
        try{
            const {todoId,date,work}=req.body;
            console.log(req.body);
            const {username}=req.user;
            if(!username)
                {
                    res.send("username not defined");
                    return;
                }
    
                const user=await User.findOne({username});
                if(!user)
                {
                    res.status(400).send("user not exist");
                    return;
                }
            if(!date || !work || !todoId)
                {
                    res.status(404).send("all fields required");
                    return;
                }
                const data=await Todo.aggregate([
                    {
                        $match:
                        {
                            username:username
                        }
                    },
                    {
                        $match:
                        {
                            todoId:todoId
                        }
                    }
                ])
               // console.log(data[0]);
            if(data.length===0)
            {
                res.status(400).send("todo not found");
                return;
            }
           
            const status=await Status.create({
                date,
                work
            })

            const statusAdded=await Todo.findOneAndUpdate(data[0]._id,{$push:{status:status._id}});
          //  console.log(statusAdded);
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
            res.status(500).json({"message":"status added successfully"})
        }

    }

const getTodo=async(req,res)=>
    {
        try {
            const {username}=req.user;
            if(!username)
            {
                res.status(400).send("username not given");
                return;
            }
           const user=await User.findOne({username});
           if(!user)
           {
            res.status(400).send("user not found")
            return;
           }

         const data=user.todo;
         let pending = [];
         let completed = [];
         let overdue = [];
         let todos;
       
        
           // Fetch all TODO items asynchronously
           todos = await Promise.all(data.map(async (id) => {
             const result = await Todo.findById(id);
             if (!result) {
               throw new Error("Todo not found");
             }
             return result;
           }));
       
           // Categorize TODO items
           todos.forEach((result) => {
             if (result?.state === "pending") {
               pending.push(result);
             } else if (result?.state === "completed") {
               completed.push(result);
             } else if (result?.state === "overdue") {
               overdue.push(result);
             }
           });
       
       
            res.status(200).json({"message":"All data of todo","todo":todos,"completed":completed,"pending":pending,"overdue":overdue});
        } catch (error) {
            console.log("error to get",error);
            res.status(500).send("internal server error");
        }
    }
const getTodoCount=async(req,res)=>
    {
        try{
           const {username}=req.user;
           if(!username)
            {
                res.status(400).send("username not given");
                return;
            }
           const user=await User.findOne({username});
           if(!user)
           {
            res.status(400).send("user not found")
           }

           const data1=user?.todo?.length;
           const data2=await Todo.aggregate([
            {
                $match:
                {
                    username:username
                }
            },
            {
                $match:
                {
                    state:"completed"
                }
            }
        ])

        const data3=await Todo.aggregate([
            {
                $match:
                {
                    username:username
                }
            },
            {
                $match:
                {
                    state:"pending"
                }
            }
        ])

        const data4=await Todo.aggregate([
            {
                $match:
                {
                    username:username
                }
            },
            {
                $match:
                {
                    state:"overdue"
                }
            }
        ])
            res.status(200).json({"total":data1,"completed":data2?.length,"pending":data3.length,"overdue":data4.length});
        }catch(err)
        {
            console.log("error to get");
            res.status(500).send("internal server error");
        }
    }

const getCompletedTodo=async(req,res)=>
    {
        try
        {
            const {username}=req.user;
            if(!username)
             {
                 res.status(400).send("username not given");
                 return;
             }
            const user=await User.findOne({username});
            if(!user)
            {
             res.status(400).send("user not found")
            }
 
            const data=await Todo.aggregate([
                {
                    $match:
                    {
                        username:username
                    }
                },
                {
                    $match:
                    {
                        state:"completed"
                    }
                }
            ])
           
            res.status(200).json({"message":"get completed todo","completedTodo":data});
        }
        catch(err)
        {
            console.log("error in get",err);
            res.status(500).send("internal server error");
        }
    }

const getPendingTodo=async(req,res)=>
    {
        try
        {
            const {username}=req.user;
            if(!username)
             {
                 res.status(400).send("username not given");
                 return;
             }
            const user=await User.findOne({username});
            if(!user)
            {
             res.status(400).send("user not found")
            }
 
            const data=await Todo.aggregate([
                {
                    $match:
                    {
                        username:username
                    }
                },
                {
                    $match:
                    {
                        state:"pending"
                    }
                }
            ])
           
           
            res.status(200).json({"message":"get pending todo","pendingTodo":data});
        }catch(err)
        {
            console.log("error in get");
            res.status(500).send("internal server error");
        }
    }

const updateState=async(req,res)=>
    {
        try{
            const {todoId,state}=req.body;
            const {username}=req.user;
            if(!username)
            {
                res.status(400).send("username not given");
                return;
            }

            const user=await User.findOne({username});
            if(!user)
            {
                res.status(400).json({"message":"user not found"});
                return;
            }

            if(!todoId)
                {
                    res.status(404).send("todo not found");
                    return;
                }
            const todo=await Todo.aggregate(
                [
                    {
                        $match:
                        {
                            username:username
                        }
                    },
                    {
                        $match:
                        {
                            todoId:todoId
                        }
                    }
                ]
            )
          
                if (todo===null) {
                return res.status(400).send("Todo with this ID does not exists for the user");
                }
            const updatedtodo=await Todo.findOneAndUpdate({todoId},{$set:{state:state}});
            
            res.status(200).json({"data":updatedtodo});
        }catch(err)
        {
            console.log("error in update",err);
            res.status(500).send("internal server error");
        }
    }

const setOverdue=async(username)=>
{
    try{
       
        if(!username)
        {  
            return;
        }

        const user=await User.findOne({username});
        if(!user)
        {
           
            return;
        }

        const data = await Todo.updateMany(
            {
                username: username,
                state:"pending",
                endDate: { $lt: new Date() } 
            },
            {

                $set: { state: "overdue" } 
            }
        );
       
        
        console.log(data);
    }
    catch(err)
    {
        
    }
}

const getOverdue=async(req,res)=>
{
    try
    {
        const {username}=req.user;
        if(!username)
            {
                res.send("username not given");
                return;
            }
    
            const user=await User.findOne({username});
            if(!user)
            {
                res.status(400).send("user not fouond");
                return;
            }

            const data=await User.aggregate([
                {
                    $match:
                    {
                        username:username
                    }
                },
                {
                    $match:
                    {
                        state:"overdue"
                    }
                }
            ]);

            res.status(200).json({"overdue":data});

    }catch(err)
    {
        console.log("error in update",err);
        res.status(500).send("internal server error");
    }
}

const upcomingDeadline=async(req,res)=>
{
    try
    {
        const {username}=req.user;
        if(!username)
            {
                res.send("username not given");
                return;
            }
    
            const user=await User.findOne({username});
            if(!user)
            {
                res.status(400).send("user not fouond");
                return;
            }

            const upcoming=await Todo.aggregate([
                {
                    $match:
                    {
                        username:username
                    }
                },
                {
                    $project:
                    {
                        days:
                        {
                            $dateDiff:
                            {
                                startDate:new Date(),
                                endDate:"$endDate",
                                unit:"day"
                            }
                        },
                        title:"$title",
                        endDate:{
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$endDate"
                          }
                        }
                    }
                    
                }
            ])

            const upcomingData=upcoming.filter((day)=>
            {
                if(day.days<=8 && day.days>=0)
                {
                    return day;
                }
            })
          
           res.status(200).json({"upcoming":upcomingData});

    }catch(err)
    {
        console.log("error in update",err);
        res.status(500).send("internal server error");
    }
}

const getStatus=async(req,res)=>
{
    try
    {
        const {todoId}=req.params;
        const {username}=req.user;
        if(!username)
            {
                res.send("username not given");
                return;
            }
    
            const user=await User.findOne({username});
            if(!user)
            {
                res.status(400).send("user not fouond");
                return;
            }
        if(!todoId)
        {
            res.status(400).json("todoid not given");
        }

        const todo=await Todo.aggregate([
            {
                $match:
                {
                    username:username
                }
            },
            {
                $match:
                {
                    todoId:todoId
                }
            }
        ])
        if(!todo)
        {
            res.status(400).json("todo not found");
            return;
        }
        const data=todo[0].status;
        const status = await Promise.all(data.map(async (s) => {
            const id = s.toString();
           // console.log(id);
            const data1 = await Status.findById(id);
            //console.log(data1);
            return { "date": data1.date.toDateString(), "work": data1.work };
        }));
        console.log(status);
        res.status(200).json({"data":status});
    }catch(err)
    {
        res.status(500).json({"message":"Internal server error"});
        return;
    }
}

const removeTodo=async(req,res)=>
{
    try
    {
        
        const {todoId}=req.body;
        const {username}=req.user;
        if(!username)
            {
                res.status(400).json("username not given");
                return;
            }   

            if(!todoId)
            {
                res.status(400).json("todo id not given");
                return;
            }

            const data=await Todo.aggregate([
                {
                    $match:
                    {
                        username:username
                    }
                },
                {
                    $match:
                    {
                        todoId:todoId
                    }
                }
            ])
 
            const data1=await Todo.findOneAndDelete({username:username,todoId:data[0]?.todoId});
            console.log(data[0]._id);
            const result = await User.updateOne(
                { username },
                { $pull: { todo:  data[0]._id.toString()  } }
              );
              console.log(result);
          
              if (result.modifiedCount === 0) {
                res.status(404).json({ message: "Todo not found or already deleted" });
                return;
              }
          
             res.status(200).json({ message: "Todo deleted successfully" });
            

    }catch(err)
    {
        console.log(err);
        res.status(500).json({"message":"Internal server error"});
        return;
    }
}

const getParticularTodo=async(req,res)=>
{
    try {
        const {username}=req.user;
        const {todoId}=req.params;
        if(!username)
        {
            res.status(404).json("username not given");
            return;
        }

        if(!todoId)
        {
            res.status(404).json("todoId not given");
            return;
        }

        const data=await Todo.aggregate([
            {
                $match:
                {
                    username:username
                }
            },
            {
                $match:
                {
                    todoId:todoId
                }
            }
        ])

        res.status(200).json({"todo":data[0]});

    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
}
export {addTodo,deleteTodo,addStatus,getTodo,getTodoCount,getCompletedTodo,getPendingTodo,updateState,getOverdue,setOverdue,upcomingDeadline,getStatus,removeTodo,getParticularTodo}