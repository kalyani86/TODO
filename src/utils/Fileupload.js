import dotenv from "dotenv"
import {v2 as cloudinary} from 'cloudinary';
import fs, { unlinkSync } from "fs";

dotenv.config({
    path:'./.env'
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDARY_NAME,
    api_key: process.env.CLOUDARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_API_SECRET 
});

const uploadOnCloudnary=async (localFilePath)=>{
    try 
    {
        console.log("local :",localFilePath);
           if(!localFilePath)
            {
                return null
            }
            console.log("api key :",process.env.CLOUDARY_API_KEY);
             const res=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto",
                }
            )

          console.log("cloudnary res ",res);
            fs.unlinkSync(localFilePath);
            return res;
        
    } 
    catch (error) {
        //remove file link from server
        console.log(error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export {uploadOnCloudnary};