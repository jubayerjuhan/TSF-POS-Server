import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email must be unique"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
  },
  passwordReset: {
    token: {
      type: String,
    },
    expiry: {
      type: Date,
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "moderator"],
      message: "Role must be either 'admin' or 'moderator'",
    },
    default: "moderator",
  },

  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: [
      function () {
        return this.role !== "admin";
      },
      "Branch Is Required",
    ],
  },
});

// Define a pre-save middleware function to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // hasing the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// add resetPassword password token and send token with email

userSchema.methods.sendResetPasswordToken = async function (next) {
  this.passwordReset.token = crypto.randomBytes(20).toString("hex");
  this.passwordReset = Date.now() + 3600000; // Expires in 1 hour
  next();
};

// password comparison middleware for user
userSchema.methods.comparePassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};
const User = mongoose.model("User", userSchema);

export default User;
