const express=require("express")
const { createOrder, getAllOrders } = require("../controllers/ordercontroller")

const router=express.Router()

router.route("/createorder").post(createOrder)

router.route("/getallorders").get(getAllOrders)

module.exports=router