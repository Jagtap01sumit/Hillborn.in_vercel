const express=require("express")
const { createCategory, getAllCategories, deleteCategory } = require("../controllers/categoryController")

const router=express.Router()

router.route("/createcategory").post(createCategory)

router.route("/getallcategories").get(getAllCategories)

router.route("/deletecategory").delete(deleteCategory)

module.exports=router