import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const auth=async(req,res,next)=>
    {
        try{
            const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
            console.log(token);
            if(!token)
            {
                res.status(404).json("unothorized req");
                return;
            }
            const data=await jwt.verify(token,process.env.ACCESS_TOKEN_SECREAT);
            console.log(data);
            
            const user=await User.findById(data._id);
            if(!user)
                {
                    res.status(404).json("unothorized req");
                    return;
                }
            req.user=user;
            next();
        }catch(err)
        {
            console.log("error in auth",err)
        }
    }
export default auth;