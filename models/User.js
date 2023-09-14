const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    // name: { type: String }, // Add a name field
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
