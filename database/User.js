import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: String,
    passwordHash: String,
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
