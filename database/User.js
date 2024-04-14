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

UserSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id.toString();
  await watchlists.deleteMany({ userId });
  await ratings.deleteMany({ userId });
  await follows.deleteMany({ userId });
  await follows.deleteMany({ follows: userId });
  next();
});

const users = new mongoose.model("User", UserSchema);

export default users;
