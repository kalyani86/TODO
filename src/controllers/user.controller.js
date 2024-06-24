import User from "../models/user.model.js";
import bcrypt from "bcrypt";

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
                httpOnly: true,        //server only
               // secure:true
            }
            res
            .cookie("accessToken",token,options)
            .status(200)
            .send("login successfully");

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
                    //return;
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
            res.send(user);

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
                httpOnly:true,
                secure:true
            }
            res
            .clearCookie("accessToken",options)
            .status(200)
            .send("logout successfully");
        }catch(err)
        {
            console.log("error in logout");
        }
    }
export {login,signup,logout};