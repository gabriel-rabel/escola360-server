// npm install cloudinary multer multer-storage-cloudinary

import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

const cloudinaryInst = cloudinary.v2;

// autenticação //
cloudinaryInst.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
   cloudinary: cloudinaryInst,
   params: {
      folder: "Escola360",
      allowed_formats: ["jpg", "png", "pdf"],
   },
});

const uploadImg = multer({ storage: storage });

export default uploadImg;
