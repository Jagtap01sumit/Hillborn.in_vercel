const Category = require("../models/Category");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await Category.create({ name });
    if (category) {
      return res.status(200).json({
        success: true,
        category,
      });
    } else {
      return next(new ErrorHandler("Category could not be created", 404));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, error));
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const categorieCount = await Category.countDocuments();

    if (categories) {
      return res.status(200).json({
        success: true,
        categories,
        categorieCount,
      });
    } else {
      return next(new ErrorHandler("Could not find categories", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error, error.status));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const catID = req.header("catID");
    if (catID) {
      const category = await Category.findByIdAndDelete({ _id: catID });
      if (category) {
        return res.status(200).json({
          success: true,
          category,
        });
      } else {
        return next(new ErrorHandler("Could not be deleted", 400));
      }
    } else {
      return next(new ErrorHandler("CategoryID is required", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error, error.code));
  }
};
