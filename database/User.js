import mongoose from "mongoose";
import { follows, ratings, watchlists } from "./models.js";

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
      default: Date.now,
    },
    pfp: {
      type: String,
      default: () => {
        return "/pfps/" + (Math.floor(Math.random() * 4) + 1) + ".png";
      },
    },
  },
  {
    versionKey: false,
  }
);

UserSchema.pre("remove", (next) => {
  watchlists.remove({ userId: this._id.toString() }).exec();
  ratings.remove({ userId: this._id.toString() }).exec();
  follows.remove({ userId: this._id.toString() }).exec();
  follows.remove({ follows: this._id.toString() }).exec();
});

const users = new mongoose.model("User", UserSchema);

export default users;
