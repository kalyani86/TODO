import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const UserSchema=new mongoose.Schema(
    {
        username:
        {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        fullname:
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        email:
        {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:
        {
            type:String,
            required:true,
            unique:true,
        }
    },
    {
        timestamps:true
    }
)

UserSchema.pre('save', async function (next) {
    try {
        console.log(this.password)
        if (this.isModified("password")) {
            this.password =await bcrypt.hash(this.password, 10);
        }
        else {
            return;
        }
        console.log("after:",this.password);
        next();
    }
    catch (err) {
        console.log("error in password bcrupt");
    }
})

//user defind method

UserSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({ 
        _id: this. _id,
        email: this.email,
        username: this.username
    }
        , process.env.ACCESS_TOKEN_SECREAT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })

    return token;
}

const User=mongoose.model("User",UserSchema);
export default User;