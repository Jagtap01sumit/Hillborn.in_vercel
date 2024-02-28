const ErrorHandler = require("../utils/ErrorHandler")
const {cloudinary}=require("../utils/cloudinary")


exports.uploadImage=async(req,res,next)=>{
    try {

        const filestr=req.body.data
        // console.log(filestr)
        const uploadedResponse=await cloudinary.uploader.upload(filestr,{
            upload_preset:"ml_default"
        })
        // console.log(uploadedResponse.url)
        if(uploadedResponse){
            return res.status(200).json({
                success:true,
                uploadedResponse:uploadedResponse.url
            })
        }else{
            return next(new ErrorHandler("Image could not be uploaded ",400))
        }
        
    } catch (error) {
        return next(new ErrorHandler(error.message,error.code))
    }
}