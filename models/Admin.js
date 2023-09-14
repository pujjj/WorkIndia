const mongoose = require("mongoose");
// const CryptoJS = require("crypto-js"); //To encrypt password
// const bcrypt = require("bcrypt");

// Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    // name: { type: String }, // Add a name field
  },
  { timestamps: true }
);

// Hash the password before saving it
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

module.exports = mongoose.model("Admin", userSchema);
