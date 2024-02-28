const mongoose=require("mongoose")

const orderSchema=new mongoose.Schema({
    cf_orderid:{
        type:String,
        required:true
    },
    my_orderid:{
        type:String,
        required:true
    },
    client_details:{
        client_id:{
            type:mongoose.Schema.ObjectId,
            ref:"user",
            // required:true
        },
        name:{
            type:String,
            // required:true
        },
        email:{
            type:String,
            // required:true
        },
        phone:{
            type:String,
            // required:true
        }
    },
    amount:{
        type:String,
        required:true
    },
    created_at:{
        type:Date
    }
})

const Order=mongoose.model("Order",orderSchema)
module.exports=Order