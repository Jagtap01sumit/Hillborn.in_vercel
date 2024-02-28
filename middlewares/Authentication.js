const ErrorHandler = require("../utils/ErrorHandler");
const jwt=require("jsonwebtoken")
const User=require("../models/User")


exports.isAutheticatedUser=async(req,res,next)=>{
    
    try {
        const {token}=req.cookies;
        
        if(!token){
            return next(new ErrorHandler("Please login to access",400))
        }else{

            const decodedData= jwt.verify(token,process.env.JWT_SECRET)
            // console.log(decodedData)
            
            req.user= await User.findById(decodedData.id)
            // console.log(req.user.role)
            next()

        }

    } catch (error) {
        // console.log(error)
        return next(new ErrorHandler(error.message,error.code))
    }
}

exports.authorizedRole=async(req,res,next)=>{
    try {
        const userRole=req.user.role

        if(userRole==="admin"){
            next()
        }else{
            return next(new ErrorHandler("You are not an admin ",400))
        }
        
    } catch (error) {
        
    }
}
        