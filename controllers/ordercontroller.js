const Order = require("../models/Order")
const ErrorHandler = require("../utils/ErrorHandler");

exports.createOrder=async(req,res,next)=>{
    const {cf_orderid, my_orderid,client_id, name,email,phone,amount,created_at}=req.body
    try {
        const client_details={
            client_id, name,email,phone
        }
        const order=await Order.create({client_details,amount,created_at,cf_orderid, my_orderid,})
        
       if(order){

        return res.status(200).json({
            success:true,
            order
        })

       }else{
        return next(new ErrorHandler("Order could not be created",400))
       }

    } catch (error) {
        return next(new ErrorHandler(error,error.status))
    }
}

exports.getAllOrders=async(req,res,next)=>{
    try {
        const orders=await Order.find()
        if(orders){
            return res.status(200).json({
                success:true,
                orders
            })
        }else{
            return next(new ErrorHandler("Could not fetch orders",400))
        }
    } catch (error) {
        return next(new ErrorHandler(error,error.status))
    }
}