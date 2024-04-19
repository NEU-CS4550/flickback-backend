import mongoose from "mongoose";
import { hash } from "@node-rs/argon2";
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
        return "/pfps/" + (Math.floor(Math.random() * 39) + 1) + ".png";
      },
    },
  },
  {
    versionKey: false,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.passwordHash) {
    this.passwordHash = await hash("123456");
  }
  next();
});

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
