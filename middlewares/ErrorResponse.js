const ErrorResponse=async (err,req,res,next)=>{
    const error={...err}
    console.log(error)
    console.log(error.statuscode)
    if (error.statuscode==11000){
        error.message="Duplicate key error"
    
    }
    return res.status( error.statusCode || error.status || 500).json({
        success:false,
        error:error.message
    })
}

module.exports=ErrorResponse