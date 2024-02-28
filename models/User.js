const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  confirmpassword: {
    type: String,
    required: [true, "Please enter confirm password password"],
    select: false,
    validate: {
      validator: function (check) {
        if (this.password === this.confirmpassword) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  phone1: {
    type: Number,
    // required:[true,"please enter your contact number"]
  },
  phone2: {
    type: Number,
    // required:[true,"please enter your contact number"]
  },
  role: {
    type: String,
    default: "customer",
  },
  cart: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "themes",
    },
  ],
});

// userSchema.pre("save",async function(next){
//     if(this.validate){
//         this.confirmpassword=undefined
//     }else{
//         console.log("Please enter valid passowrd")
//     }
// })

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.password !== this.confirmpassword) {
      return next(new Error("Password and confirmation password do not match"));
    }
  }
  next();
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(this.password, salt);
  this.password = password;
  next();
});

userSchema.methods.passwordMatcher = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
