const express=require("express")
const { addToCart, getcartItems, deleteFromCart, deleteAllFromCart } = require("../controllers/cartController")

const router=express.Router()

router.route("/addtocart").post(addToCart)

router.route("/getcartitems").get(getcartItems)

router.route("/deletefromcart").delete(deleteFromCart)

router.route("/deleteallfromcart").delete(deleteAllFromCart)

module.exports=router