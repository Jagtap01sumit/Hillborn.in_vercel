const mongoose=require("mongoose")

const themesSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        default:9999
    },
    category:{
        type:String,
        required:true
    },
    siteurl:{
        type:String,
        required:true
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true,
            },

            name:{
                type:String,
                required:true
                
            },
            rating:{
                type:Number,
                required:true

            },
            comment:{
                type:String,
                required:true
            }
    }
],
})

const Themes=mongoose.model("Themes",themesSchema)
console.log(Themes);
module.exports=Themes
