import express from "express";
import uploadImg from "../config/cloudinary.config.js";

const uploadRoute = express.Router();

// multer é um middleware
uploadRoute.post("/file", uploadImg.single("picture"), (req, res) => {
   try {
      // se foi feito o upload com sucesso, a url vai ser disponibilizada em
      // req.file.url => a url da nossa foto uploaded.

      console.log(req.file);

      if (!req.file) {
         throw new Error("Algo deu errado com o upload da foto");
      }

      return res.status(201).json({ url: req.file.path });
   } catch (error) {
      console.log(error);
      return res.status(500).json(error);
   }
});

export default uploadRoute;
