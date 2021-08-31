const express = require("express");
const router = express.Router();
const Images = require("../models/images");
const mongoose = require("mongoose");
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

let storage = multer.diskStorage({
    destination : (req, file,cb)=>{
      cb(null, './upload/')
    },
    filename:(req, file, cb)=>{
      cb(null,file.originalname)
    }
  });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
  
let upload = multer({storage: storage});

router.post('/upload',upload.single('image'),(req,res,next)=>{
    let image = new Images({
        images: req.file.path
    });
    image.save();
    console.log(req.file);
    res.json('/uploads api')
});
router.post('/online_upload', async(req,res)=>{
    try{
        const data = {
            image: req.files.image,
        }
        let uploadedImg = await cloudinary.uploader.upload(data.image.tempFilePath);
        console.log(uploadedImg);
        res.status(200).send('success');
    }catch(err){
        console.log(err);
        res.status(500).send("failure");
    }
   
})

router.get('/images', async(req,res)=>{
    let image = await Images.find();
    res.status(200).send(image);
});

module.exports = router;