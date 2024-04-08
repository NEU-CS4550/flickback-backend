import mongoose from "mongoose";

const FollowsSchema = new mongoose.Schema(
  {
    userId: String,
    follows: String,
  },
  {
    versionKey: false,
  }
);

const follows = new mongoose.model("Follows", FollowsSchema);

export default follows;
