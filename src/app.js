import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({credentials: true, origin: true, withCredentials: true }));

app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"2kb"}));
app.use(express.static("public"));


app.use(cookieParser());


import  userRouter  from "./routes/user.router.js";
import todoRouter from "./routes/todo.route.js";

app.use('/users',userRouter);
app.use('/todo',todoRouter);

export {app}