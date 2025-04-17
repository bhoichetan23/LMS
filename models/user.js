const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLenght: [5, "Name must be atleast 5 characters"],
      maxLenght: [50, "Name shold be less than 50 characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLenght: [8, "Password must be atleast 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },

    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 10);
  console.log(user.password);
  next();
});

userSchema.methods.generateJWTToken = async function () {
  const user = this;

  const token = await jwt.sign(
    {
      _id: user._id,
      email: user.email,
      subscription: user.subscription,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare({
    passwordInputByUser,
    hashedPassword,
  });

  return isPasswordValid;
};

userSchema.methods.generatePasswordResetToken = async function () {
  const user = this;

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.forgotPasswordExpiry = Date.now() + 5 * 60 * 1000; // 5 mins from now

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
