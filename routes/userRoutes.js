const express=require("express")
const {register,login,googlelogin,getUserDetails,addToCart}=require("../controllers/userAuth")

const router=express.Router()


router.route("/register").post(register)

router.route("/login").post(login)

router.route("/googlelogin").post(googlelogin);

router.route("/getuserdetails").get(getUserDetails)

router.route("/addtocart").post(addToCart)



module.exports=router