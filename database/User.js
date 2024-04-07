import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: String,
    passwordHash: String,
    role: {
      type: String,
      default: "USER",
    },
    registered: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

const users = new mongoose.model("User", UserSchema);

export default users;
