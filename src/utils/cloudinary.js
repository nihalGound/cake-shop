import {v2 as cloudinary, v2} from "cloudinary";
import fs from "fs";


cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_secret:process.env.CLOUDINARY_API_SECRET,
        api_key:process.env.CLOUDINARY_API_KEY
    }
);

const uploadOnCloudinary = async (localPath)=>{
    try {
        const response = await v2.uploader.upload(localPath,{resource_type:"auto"});
        console.log(response.url);
        fs.unlinkSync(localPath);
        return response;
    } catch (error) {
        fs.unlinkSync(localPath);
        console.log(error);
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const response = await cloudinary.uploader.destroy({publicId:publicId});
        if (response.result === "ok") {
            return { success: true, message: "File deleted from Cloudinary successfully" };
        } else {
            return { success: false, message: "Failed to delete file from Cloudinary" };
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};


export {uploadOnCloudinary,deleteFromCloudinary};