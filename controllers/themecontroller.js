const Themes = require("../models/Themes");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createTheme = async (req, res, next) => {
  const { title, description, price, img, category, siteurl } = req.body;

  try {
    const theme = await Themes.create({
      title,
      description,
      price,
      img,
      category,
      siteurl,
    });
    if (!theme) {
      return next(new ErrorHandler("Theme could not be created", 400));
    } else {
      return res.status(200).json({
        success: true,
        theme,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

exports.getAllThemes = async (req, res, next) => {
  try {
    const themes = await Themes.find();
    const themescount = await Themes.countDocuments();

    if (themes) {
      return res.status(200).json({
        success: true,
        themescount,
        themes,
      });
    } else {
      return next(new ErrorHandler("Themes not found", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

exports.getOneTheme = async (req, res, next) => {
  let themeID = req.header("themeID");
  try {
    const theme = await Themes.findById({ _id: themeID });
    if (!theme) {
      return next(new ErrorHandler("Theme not found", 400));
    } else {
      return res.status(200).json({
        success: true,
        theme,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, error.status));
  }
};

exports.updateTheme = async (req, res, next) => {
  try {
    const themeID = await req.header("themeID");
    const { title, description, category, price } = req.body;
    const theme = await Themes.findById({ _id: themeID });

    if (theme) {
      const newTheme = { title, description, category, price };
      let updateTheme = await Themes.findByIdAndUpdate(
        themeID,
        { $set: newTheme },
        { new: true }
      );
      if (updateTheme) {
        res.status(200).json({
          success: true,
          updateTheme,
        });
      } else {
        return next(new ErrorHandler("Failed to update the theme", 400));
      }
    } else {
      return next(new ErrorHandler("Theme not found", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, error.statuscode));
  }
};

// exports.deleteTheme = async (req, res, next) => {
//   const themeID = req.params.themeID; 
//   if (!themeID) {
//     return next(new ErrorHandler("Theme not selected", 400));
//   }

//   try {
//     const theme = await Themes.findByIdAndDelete({_id:themeID});

//     if (theme) {
//       res.status(200).json({
//         success: true,
//         message: "Theme deleted successfully",
//         deletedtheme: theme, 
//       });
//     } else {
//       return next(new ErrorHandler("Theme not found", 404));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500));
//   }
// };
exports.deleteTheme=async(req,res,next)=>{
  console.log("Delete");
    try {
        const themeID=req.params.themeID;
        console.log(themeID);
        if(themeID){
            const theme=await Themes.findByIdAndDelete({_id:themeID})
            if(theme){
                return res.status(200).json({
                    success:true,
                    theme
                })
            }else{
                return next(new ErrorHandler("Could not be deleted",400))
            }
        }else{
            return next(new ErrorHandler("ThemeID is required",400))
        }
    } catch (error) {
        return next(new ErrorHandler(error,error.code))
        console.log(error);
    }
}
exports.updateAllThemes = async (req, res, next) => {
  try {
    const allupdatetheme = await Themes.updateMany(
      {},
      { $set: { numOfReviews: 0, reviews: [] } }
    );
    return res.status(200).json({
      success: true,
      allupdatetheme,
    });
  } catch (error) {
    return next(new ErrorResponse(error, error.status));
  }
};

exports.createThemeReview = async (req, res, next) => {
  let userID = req.header("userID");
  let themeID = req.header("themeID");
  let userName = req.header("userName");

  const { rating, comment } = req.body;

  try {
    const review = {
      user: userID,
      name: userName,
      rating: Number(rating),
      comment,
    };

    const theme = await Themes.findById(themeID);

    const isReviewed = theme.reviews.find(
      (rev) => rev.user.toString() === userID
    );

    if (isReviewed) {
      theme.reviews.forEach((rev, index) => {
        if (rev.user.toString() === userID) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      theme.reviews.push(review);
      theme.numOfReviews = theme.reviews.length;
    }

    let avg = 0;

    theme.reviews.forEach((rev, index) => {
      avg = avg + rev.rating;
    });

    theme.ratings = avg / theme.reviews.length;

    await theme.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, error.code));
  }
};

exports.deleteThemeReview = async (req, res, next) => {
  let userID = req.header("userID");
  let themeID = req.header("themeID");
  try {
    // 635253e77a167c80ee93dd81
    const theme = await Themes.findById(themeID);
    let reviews = theme.reviews.filter((ele, index) => {
      return ele.user != userID;
    });

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Themes.findByIdAndUpdate(
      themeID,
      { reviews, ratings, numOfReviews },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error, error.status));
  }
};

exports.getAllReviews = async (req, res, next) => {
  let userID = req.header("userID");
  let themeID = req.header("themeID");
  try {
    const user = await User.findById({ _id: userID });

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    if (user.role != "admin") {
      return next(
        new ErrorHandler("You are not allowed to perform this action", 400)
      );
    } else {
      const theme = await Themes.findById({ _id: themeID });
      let reviews = theme.reviews.map((ele, index) => {
        return ele;
      });

      return res.status(200).json({
        success: true,
        reviews,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, error.status));
  }
};
