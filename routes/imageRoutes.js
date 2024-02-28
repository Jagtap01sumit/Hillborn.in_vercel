const express=require("express")
const { uploadImage } = require("../controllers/imagecontroller")

const router=express.Router()

router.route("/upload").post(uploadImage)


module.exports=router