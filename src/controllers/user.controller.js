import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { uploadOnCloudnary } from "../utils/Fileupload.js";

import jwt from "jsonwebtoken";
import { setOverdue } from "./todo.controller.js";
const login=async(req,res)=>
    {
        try{
        const {email,password}=req.body;
        if(!email)
            {
                res.status(404).json({"message":"email not found"});
                return;
            }
        if(!password)
            {
                res.status(404).json({"message":"password not found"});
                return;
            }

            const user=await User.findOne({email});
            if(!user)
                {
                    res.status(404).send("user not found");
                    return;
                }
            console.log(user);
            console.log(user.password,password);
            const result=await bcrypt.compare(password, user.password);
            console.log(result);
            if(!result)
                {
                    res.status(404).send("unothorized request");
                    return;
                }
            const token=await user.generateAccessToken();
            console.log(token);
            const options={
                httpOnly: true,                                                                                 // Optional: Only accessible by the web server
               
            }
            const user1=await User.findOne({email}).select("-password");
            setOverdue(user.username)
            console.log(user1);
            res
            .cookie("accessToken",token, { sameSite: 'none', secure: true ,expires:new Date(Date.now()+4000000)})
            .status(200)
            .json({"message":"login successful"})

        }catch(err)
        {
            console.log("error in login",err);
        }
    }

const signup=async(req,res)=>
    {
        try{
            //console.log(req);
           const {username,email,fullname,password}=req.body;
           console.log(req.body);
            if(!username || !email || !fullname || !password)
                {
                    res.status(404).send("All fields required");
                    return;
                }
            const data=await User.findOne({username});
            if(data)
            {
                res.status(400).send("user already exist");
                return;
            }
            console.log(req.body);
            const user=await User.create(
                {
                    username,
                    email,
                    password,
                    fullname
                }

            )
           
            console.log("user",user)
            if(!user)
                {
                    res.status(404).send("user not created");
                    return;
                }
            console.log(user);
            res.json({"user":user});

        }catch(err)
        {
            console.log("error",err);
        }

    }

const logout=async(req,res)=>
    {
        try{
           const user=req.user;
            console.log(user);
            const options={
                
                httpOnly: true,      // Optional: Only accessible by the web server
                domain:'localhost:5173'
            }
            res
            .clearCookie("accessToken",{ sameSite: 'none', secure: true ,expires:new Date(Date.now()+4000000)})
            .status(200)
            .send("logout successfully");
        }catch(err)
        {
            console.log("error in logout");
        }
    }

const uploadPhoto=async(req,res)=>
    {
        try {
            console.log("hi");
            const {email}=req.body;
            const file=req.file;
            console.log(email,file)
            console.log(file.path);
            if(!file.path)
            {
                    res.send("file not found");
                    return;
            }

            const re=await uploadOnCloudnary(req.file?.path);
            console.log(re);
            if(!re)
                {
                    res.status(404).send("not upload on cloudnary");
                    return;
                }
            const data=await User.findOneAndUpdate({email},
                {
                    $set:
                    {
                        ProfilePhoto:re.url
                    }
                }
            )
            if(!data)
                {
                    console.log("fail to upload in db");
                }
            console.log(data);
            res.send("photo upload");
        } catch (error) {
            console.log("error in photo upload",error)
        }
    }

    const isAuth=async(req,res)=>
    {
        try{
            const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
            console.log(token);
            if(!token)
             {
                    res.status(404).json({"message":"unothorized req"});
                    return;
                }
            const data=await jwt.verify(token,process.env.ACCESS_TOKEN_SECREAT);
            console.log(data);
            
            const user=await User.findById(data._id);
            if(!user)
                {
                    res.status(404).send("unothorized req");
                    return;
                }
            res.status(200).json({"user":user});
           
        }catch(err)
        {
            console.log(err);
            res.status(404).json({"message":"unothorized req"});
                return;
        }
    }

const getData=async(req,res)=>
{
    try
    {
        const {username}=req.body;
        if(!username)
        {
            res.send("username not given");
            return;
        }

        const data=await User.findOne({username});
        if(!data)
        {
            res.status(400).send("user not found");
            return;
        }

        res.status(200).json({"data":data});
    }catch(err)
    {
        console.log(err);
        res.status(404).json({"message":"unothorized req"});
                return;
    }
}


// const EditData=async(req,res)=>
// {
//     try
//     {
//         const {username}=req.body;

//     }
//     catch(err)
//     {
//         console.log(err);
//         res.status(500).send("Internal server error");
//     }
// }
export {login,signup,logout,uploadPhoto,isAuth,getData};