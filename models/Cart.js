const mongoose=require("mongoose")

const cartSchema=new mongoose.Schema({
    themeID:{
        type:mongoose.Schema.ObjectId,
        ref:"themes",
        required:true
    },
    userID:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    }
})

const Cart=mongoose.model("Cart",cartSchema)
module.exports=Cart