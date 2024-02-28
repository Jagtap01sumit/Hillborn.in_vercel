const express=require("express")
const { getClientDetails } = require("../controllers/payementController")

const router=express.Router()

router.route("/getclientdetails").post(getClientDetails)

module.exports=router