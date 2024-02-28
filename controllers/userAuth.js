const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendToken");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.Google_id, "postmessage");

exports.googlelogin = async (req, res, next) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.Google_id,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      const { _id, name, email } = user;

      return res.json({
        token,
        user: { _id, name, email },
      });
    } else {
      // If the user does not exist, you can create a new user here
      const password = email + process.env.JWT_SECRET;
      const newUser = new User({
        name: payload.name,
        email: email,
        password: password,
        confirmpassword: password,
      });

      await newUser.save();

      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      return res.json({
        token,
        user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      });
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Something went wrong..", 500));
  }
};

exports.register = async (req, res, next) => {
  const { name, email, password, confirmpassword, phone1, phone2, role } =
    await req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      confirmpassword,
      phone1,
      phone2,
      role,
    });

    if (user) {
      sendToken(user, 201, res);
    }
    if (!user) {
      return next(new ErrorHandler("User could not be created", 400));
    }
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, error.code));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = await req.body;
  try {
    if (!email || !password) {
      await next(new ErrorHandler("Please enter email or password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(
        new ErrorHandler("Please enter valid email or passowrd", 400)
      );
    } else {
      const isMatched = await user.passwordMatcher(password);

      if (isMatched) {
        sendToken(user, 201, res);
      } else {
        return next(
          new ErrorHandler("Please enter valid email or passowrd", 400)
        );
      }
    }
  } catch (error) {
    // console.log(error)
    return next(
      new ErrorHandler(
        error.message,
        error.code || error.statuscode || error.statusCode
      )
    );
  }
};

exports.getUserDetails = async (req, res, next) => {
  const userID = req.header("userID");
  try {
    const user = await User.findById({ _id: userID });
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    } else {
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, error.code));
  }
};

exports.addToCart = async (req, res, next) => {
  const userID = req.header("userID");
  const themeID = req.header("themeID");
  try {
    const user = await User.findById({ _id: userID });
    // const user2=await User.findByIdAndUpdate({_id:userID},{cart:themeID})
    if (user) {
      console.log(user.cart);
      user.cart.push(themeID);
      console.log(user.cart);
      await user.save({ validateBeforeSave: false });
      // res.status(200).json({
      //     success:true,
      // })
    } else {
      return next(new ErrorHandler("User not found", 404));
    }
  } catch (error) {
    return next(new ErrorHandler(error, error.status));
  }
};
