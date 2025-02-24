"use strict";

const mongoose = require("mongoose");
const argon2 = require("argon2");
const Schema = mongoose.Schema;

// USER MODEL
const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "Email cannot be empty"],
      match: [/\S+@\S+\.\S+/, "Must be valid email"]
    },
    password: { type: String, required: true },
    // If not true, password is still stored in plaintext and needs to be hashed
    passwordMigrated: { type: Boolean, default: true },
    binders: { type: [String], default: undefined },
    curr: { type: String, default: "usd" }
  },
  { timestamps: true }
);

// Takes a plaintext input password and compares it to the password hash
UserSchema.methods.comparePassword = async function (input) {
  return await argon2.verify(this.password, input);
};

module.exports = mongoose.model("User", UserSchema);
