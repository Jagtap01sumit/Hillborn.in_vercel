const Cart = require("../models/Cart")
const ErrorHandler = require("../utils/ErrorHandler")

exports.addToCart=async(req,res,next)=>{
    const userID=req.header("userID")
    const themeID=req.header("themeID")
    try {
        const cart=await Cart.create({userID,themeID})
        if(cart){
            return res.status(200).json({
                success:true,
                message:"Successfully added to cart",
                cart
            })
        }else{
            return next(new ErrorHandler("Could not be added to cart",400))
        }
    } catch (error) {
        return next(new ErrorHandler(error.message,error.status))
    }
}

exports.getcartItems=async(req,res,next)=>{
    const userID=req.header("userID")
    try {
        const cartitems=await Cart.find({userID:userID})
        const cartitemscount=await Cart.countDocuments({userID:userID})
        if(cartitems){
            return res.status(200).json({
                success:true,
                cartitemscount,
                cartitems
            })
        }else{
            return next(new ErrorHandler("Cart items not found",400))
        }
    } catch (error) {
        return next(new ErrorHandler(error.message,error.status))
    }
}

exports.deleteFromCart=async(req,res,next)=>{
    const userID=req.header("userID")
    const cartitemID=req.header("cartitemID")
    try {
        const cartitem=await Cart.findById({_id:cartitemID})
        if(cartitem){
            if(cartitem.userID.toString()==userID){
                const removeitem=await Cart.findByIdAndDelete({_id:cartitemID})
                if(removeitem){
                    return res.status(200).json({
                        success:true,
                        removeitem
                    })
                }else{
                    return next(new ErrorHandler("Could not be deleted"))
                }
            }else{
                return next(new ErrorHandler("Your are not authorized to access this",400))
            }
        }else{
            return next(new ErrorHandler("Cart item not found",404))
        }
    } catch (error) {
        return next(new ErrorHandler(error.message,error.status))
    }
}

exports.deleteAllFromCart=async(req,res,next)=>{
    const userID=req.header("userID")
    try {
        const cartitems=await Cart.find({userID:userID})
        if(cartitems){
            const arr=cartitems.map(async (ele,index)=>{
                return await Cart.findByIdAndDelete({_id:ele._id})
            })
            // const deleteditems=await Cart.find({userID:userID})
            const deleteditemscount=arr.length
            if(arr){
                return res.status(200).json({
                    success:true,
                    deleteditemscount,
                    arr
                })
            }else{
                return next(new ErrorHandler("Could not be deleted",400))
            }
        }else{
            return next(new ErrorHandler("Cart is empty",400))
        }
    } catch (error) {
        return next(new ErrorHandler(error.message,error.status))
    }
}