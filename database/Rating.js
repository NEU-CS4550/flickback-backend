import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    pfp: String,
    movieId: Number,
    movieName: String,
    score: Number,
    review: String,
    submitted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const ratings = new mongoose.model("Rating", RatingSchema);

export default ratings;
